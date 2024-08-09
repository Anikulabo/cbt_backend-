const { Op } = require("sequelize");
// Updated notifyauser function with dependency injection
exports.notifyauser = async (
  obj,
  { typechecker, Activities, Notifications, io }
) => {
  // Define expected keys and their types
  const expectedKeys = [
    { key: "description", type: "string" },
    { key: "performed_by", type: "number" },
    { key: "roleOfperformer", type: "string" },
    { key: "transaction", type: "object" },
    { key: "recipient", type: "number" },
    { key: "roleOfrecipient", type: "number" },
  ];

  // Validate object properties using typechecker
  const check = typechecker(obj, expectedKeys);
  if (Array.isArray(check)) {
    const {
      description,
      performed_by,
      roleOfperformer,
      transaction,
      recipient,
      roleOfrecipient,
    } = obj;

    // Create activity entry
    const activity = await Activities.create(
      {
        description,
        performed_by,
        createdAt: new Date(),
        role: roleOfperformer,
      },
      { transaction }
    );

    // Notify user online based on recipient role
    if (roleOfrecipient === 3) {
      io.to(`student_${recipient}`).emit(description);
    } else if (roleOfrecipient === 2) {
      io.to(`teacher_${recipient}`).emit(description);
    }

    // Save notification for users who might be offline
    await Notifications.create(
      { activity_id: activity.id, to: recipient, type: roleOfrecipient },
      { transaction }
    );
  }
};

// Ensure proper dependency injection
exports.addsession = async (
  req,
  res,
  { models, io, assignClass, notifyauser, notifyallparties }
) => {
  const { sessionName, term } = req.body;
  const {
    sequelize,
    Sessions,
    Registration,
    Class,
    Subjects,
    Activities,
    Categories,
  } = models;

  let transaction;
  try {
    transaction = await sequelize.transaction();
    try {
      // Determine if the new session to be uploaded is still the active session
      await Sessions.update({ active: false }, { transaction }); // to make sure every other session is rendered inactive

      const session_in_progress = await Sessions.findAll({
        where: { sessionName },
        transaction,
      });

      if (session_in_progress.length > 0) {
        // The admin is just adding a term to an existing session
        await Sessions.create({ sessionName, term }, { transaction });
      } else {
        // This is for the case where a new session is being added by the admin

        // Find all admitted students
        const admittedusers = await Registration.findAll({
          where: { year: { [Op.gt]: 0 } },
          transaction,
        });

        // Find all available classes for admitted users
        const allClasses = await Class.findAll();

        // Process user updates
        const userPromises = admittedusers.map(async (user) => {
          const category = await Categories.findOne({
            where: { id: user.category_id },
            transaction,
          });

          if (user.year < category.year) {
            // Increase the year of the student due to new session
            const newYear = user.year + 1;
            // Assign a new class to the student
            const chosenClass = assignClass({
              cate: user.category_id,
              dept: user.department_id,
              year: newYear,
            });

            await Registration.update(
              { year: newYear, class_id: chosenClass.classid },
              { where: { id: user.id }, transaction }
            );

            const obj = {
              description: `Congratulations! You've been promoted to year ${newYear}. Your class is: ${chosenClass.classmname}`,
              performed_by: 0,
              roleOfperformer: 0,
              transaction: transaction,
              recipient: user.id,
              roleOfrecipient: 3,
            };

            await notifyauser(obj, io);

            const indexOfChosenClass = allClasses.findIndex(
              (detail) => detail.id === chosenClass.classid
            );
            if (indexOfChosenClass !== -1) {
              const initialNumberOfStudents =
                allClasses[indexOfChosenClass].totalstudents || 0;
              allClasses[indexOfChosenClass].totalstudents =
                initialNumberOfStudents + 1;
            }
          } else {
            await Registration.update(
              { year: 0, class_id: 0 },
              { where: { id: user.id }, transaction }
            );

            const obj = {
              description: `Congratulations! You're finally done with category: ${category.categoryName}`,
              performed_by: 0,
              roleOfperformer: 0,
              transaction: transaction,
              recipient: user.id,
              roleOfrecipient: 3,
            };

            await notifyauser(obj, io);
          }
        });

        // Process class updates
        const classPromises = allClasses.map(async (unique) => {
          const compulsorySubjects = await Subjects.findAll({
            where: {
              category_id: unique.category_id,
              year: unique.year,
              compulsory: true,
              [Op.or]: [
                { department_id: unique.department_id },
                { department_id: 0 },
              ],
            },
            transaction,
          });

          const activity = await Activities.create(
            {
              description: `System just registered ${unique.totalstudents} students to ${unique.classname}`,
              performed_by: 0,
              createdAt: new Date(),
              role: 1,
            },
            { transaction }
          );

          // Notify all interested teachers
          const dep = {
            classid: unique.id,
            subjects: compulsorySubjects,
            transaction,
            classmessage: `Just registered ${unique.totalstudents} students to your class`,
            subjectsmessage: `Just registered ${unique.totalstudents} students to your subject from class ${unique.classname}`,
            author: "system",
            activity_id: activity.id,
            teacherid: unique.teacherid,
          };

          await notifyallparties(dep);
        });

        userPromises.push(
          Sessions.create({ sessionName, term }, { transaction })
        );

        await Promise.all(userPromises);
        await Promise.all(classPromises);
      }

      await transaction.commit();
      return res
        .status(201)
        .json({ message: "Session has been successfully updated" });
    } catch (error) {
      await transaction.rollback();
      console.error("Error during session update:", error);
      return res.status(500).json({ message: "The server is down for now" });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    return res.status(500).json({
      message: "Couldn't start transaction, probably the server is down",
    });
  }
};

// Ensure proper dependency injection
exports.updatesession = async (req, res, { models, objectreducer }) => {
  const { id } = req.params;
  const { sessionName, term } = req.body;
  const { sequelize, Sessions } = models;

  // Input validation
  if (!id || !sessionName || !term) {
    return res.status(400).json({ message: "Invalid input parameters" });
  }

  try {
    // Find the session by id
    const sessionDetail = await Sessions.findOne({ where: { id } });
    if (!sessionDetail) {
      return res
        .status(404)
        .json({ message: "No session found with the given ID" });
    }

    // Calculate the changes
    const allChanges = objectreducer(sessionDetail, { sessionName, term });

    // Update sessions based on the changes
    if (allChanges.changeditems.length === 2) {
      // If 2 items changed, update all sessions with the same name and the current session
      await Sessions.update(allChanges.updatedEntries["sessionName"], {
        where: { sessionName: sessionDetail.sessionName },
      });
      await Sessions.update(allChanges.updatedEntries["term"], {
        where: { id },
      });
    } else {
      // Otherwise, update only the relevant fields
      if (allChanges.changeditems.includes("sessionName")) {
        await Sessions.update(allChanges.updatedEntries, {
          where: { sessionName: sessionDetail.sessionName },
        });
      }
      if (allChanges.changeditems.includes("term")) {
        await Sessions.update(allChanges.updatedEntries, {
          where: { id },
        });
      }
    }

    // Send a success response
    return res.status(200).json({ message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating session:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the session" });
  }
};

// Ensure proper dependency injection
exports.viewsessions = async (req, res, { models }) => {
  const { username, userid, role } = req.user;
  const { name } = req.params;
  const { sequelize, Sessions, Registration, Score } = models;

  // Input validation
  if (!username || !userid || role === undefined) {
    return res.status(400).json({ message: "Invalid input parameters" });
  }

  try {
    const transaction = await sequelize.transaction();
    let results = [];

    try {
      // Student role
      if (role === 3) {
        const query = `
          SELECT registration.id, categories.categoryName, registration.year, registration.session_id 
          FROM registration 
          LEFT JOIN categories ON registration.category_id = categories.id 
          WHERE regNo = :username
        `;
        const details = await Registration.sequelize.query(query, {
          replacements: { username },
          type: sequelize.QueryTypes.SELECT,
          transaction,
        });

        if (details.length === 0) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "No registration details found for the student" });
        }

        const studentDetails = details[0];
        const attendedSessions = await Sessions.findAll({
          where: { id: { [Op.gte]: studentDetails.session_id } },
          attributes: ["id", "sessionName", "term"],
          order: [["id", "desc"]],
          transaction,
        });

        if (attendedSessions.length > 0) {
          let year = studentDetails.year;

          for (const session of attendedSessions) {
            if (year > 0) {
              const existingSession = results.find(
                (detail) => detail.sessionName === session.sessionName
              );

              if (!existingSession) {
                results.push({
                  sessionName: session.sessionName,
                  term: session.term,
                  categoryName: studentDetails.categoryName,
                  year: year,
                });
                year--;
              }
            } else if (results.length < attendedSessions.length) {
              const pastDetailsQuery = `
                SELECT classes.year, categories.categoryName 
                FROM classes 
                LEFT JOIN scores ON classes.id = scores.class_id 
                LEFT JOIN categories ON classes.category_id = categories.id 
                WHERE user_id = :userId AND session_id = :sessionId 
                LIMIT 1
              `;
              const pastDetails = await Score.sequelize.query(
                pastDetailsQuery,
                {
                  replacements: {
                    userId: studentDetails.id,
                    sessionId: session.id,
                  },
                  type: sequelize.QueryTypes.SELECT,
                  transaction,
                }
              );

              if (pastDetails.length > 0) {
                const pastDetail = pastDetails[0];
                results.push({
                  sessionName: session.sessionName,
                  term: session.term,
                  categoryName: pastDetail.categoryName,
                  year: pastDetail.year,
                });
              }
            }
          }
        }
      }

      // Teacher role
      if (role === 2) {
        const collatedResult = {};
        const allSessions = await Sessions.findAll({ transaction });

        const uniqueSessions = [
          ...new Set(allSessions.map((session) => session["sessionName"])),
        ];

        for (const session of uniqueSessions) {
          const termsWithin = allSessions
            .filter((item) => item["sessionName"] === session)
            .map(({ id, term }) => ({ id, term }));

          collatedResult[session] = termsWithin;
        }

        results = collatedResult;
      }

      // Admin role
      if (role === 1) {
        const collatedResult = {};

        if (name) {
          const allTerms = await Sessions.findAll({
            where: { sessionName: name },
            transaction,
          });

          collatedResult["Terms"] = allTerms.length;
          const sessionIds = [...new Set(allTerms.map(({ id }) => id))];
          const studentRegistered = await Registration.findAll({
            where: {
              id: {
                [Op.and]: [
                  { [Op.gte]: Math.min(...sessionIds) },
                  { [Op.lte]: Math.max(...sessionIds) },
                ],
              },
            },
            transaction,
          });

          collatedResult["StudentRegistered"] = studentRegistered.length;
        } else {
          const allSessions = await Sessions.findAll({ transaction });
          results = [
            ...new Set(allSessions.map(({ sessionName }) => sessionName)),
          ];
        }

        results = collatedResult;
      }

      await transaction.commit();
      return res.status(200).json({ sessions: results });
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction error:", error);
      return res.status(500).json({
        message: "An error occurred while processing the transaction",
      });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "The server is down for now" });
  }
};
