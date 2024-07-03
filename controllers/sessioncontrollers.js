const { Op } = require("sequelize");
const { sequelize } = require("../models");
const Sessions = require("../models/session");
const { notifyallparties, objectreducer } = require("./jwtgeneration");
const Subjects = require("../models/subjects");
const io = require("../index");
const Registration = require("../models/registration");
const Categories = require("../models/categories");
const { assignClass } = require("./jwtgeneration");
const Activities = require("../models/activities");
const Class = require("../models/class");
const Score = require("../models/scores");
const { typechecker } = require("./jwtgeneration");
const Notifications = require("../models/notification");
exports.notifyauser = async (obj) => {
  let expectedkeys = [
    { key: "description", type: "string" },
    { key: "performed_by", type: "number" },
    { key: "roleOfperformer", type: "string" },
    { key: "transaction", type: "object" },
    { key: "recipient", type: "number" },
    { key: "roleOfrecipient", type: "number" },
  ];
  // to validate types and some other checks
  const check = typechecker(obj, expectedkeys);
  if (Array.isArray(check)) {
    const {
      description, // should be a striing
      performed_by, // should be a number :id of the performer
      roleOfperformer, // should also be a number:0 for the system,1 for admin,2 for teacher,3 for student
      transaction, // should be an object holding the transaction
      recipient, // also be a number :id of receiver
      roleOfrecipient, //should also be a number:0 for the system,1 for admin,2 for teacher,3 for student
    } = obj;
    const activity = await Activities.create(
      {
        description,
        performed_by,
        createdAt: new Date(),
        role: roleOfperformer,
      },
      transaction
    );
    //online notification of user
    // recipient is a student
    if (roleOfrecipient === 3) {
      io.to(`student_${recipient}`).emit(description);
    }
    //recipient is a teacher
    if (roleOfrecipient === 2) {
      io.to(`teacher_${recipient}`).emit(description);
    }
    //save notification for case where student might not be online
    await Notifications.create(
      { activity_id: activity.id, to: recipient, type: roleOfrecipient },
      transaction
    );
  }
};
exports.addsession = async (req, res) => {
  const { sessionName, term } = req.body;
  try {
    const transaction = await sequelize.transaction();
    try {
      // Determine if the new session to be uploaded is still the active session
      await Sessions.update({ active: false }, { transaction }); // to make sure every other session is rendered inactive
      const session_in_progress = await Sessions.findAll(
        { where: { sessionName } },
        { transaction }
      );

      if (session_in_progress.length > 0) {
        // The admin is just adding a term to an existing session
        await Sessions.create({ sessionName, term }, { transaction });
      } else {
        // This is for the case where a new session is being added by the admin

        // Find all admitted students
        const admittedusers = await Registration.findAll(
          {
            where: { year: { [Op.gt]: 0 } },
          },
          { transaction }
        );

        // Find all available classes for admitted users
        const allClasses = await Class.findAll();

        const userPromises = admittedusers.map(async (user) => {
          const category = await Categories.findOne(
            { where: { id: user.category_id } },
            { transaction }
          );

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
              { where: { id: user.id } },
              { transaction }
            );
            const obj = {
              description: `congratulation you've been promoted to year ${newYear} your class is:${chosenClass.classmname}`,
              performed_by: 0,
              roleOfperformer: 0,
              transaction: transaction,
              recipient: user.id,
              roleOfrecipient: 3,
            };
            await this.notifyauser(obj);
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
              { where: { id: user.id } },
              { transaction }
            );
            const obj = {
              description: `congratulation you're finally done with category: ${category.categoryName}`,
              performed_by: 0,
              roleOfperformer: 0,
              transaction: transaction,
              recipient: user.id,
              roleOfrecipient: 3,
            };
            await this.notifyauser(obj);
          }
        });

        const classPromises = allClasses.map(async (unique) => {
          const compulsorySubjects = await Subjects.findAll(
            {
              where: {
                category_id: unique.category_id,
                year: unique.year,
                compulsory: true,
                [Op.or]: [
                  { department_id: unique.department_id },
                  { department_id: 0 },
                ],
              },
            },
            { transaction }
          );

          const activity = await Activities.create(
            {
              description: `system just registered ${unique.totalstudents} student to ${unique.classname}`,
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
            classmessage: `just registered ${unique.totalstudents} student to your class`,
            subjectsmessage: `just registered ${unique.totalstudents} student to your subject from class ${unique.classname}`,
            author: "system",
            activity_id: activity.id,
            teacherid: unique.teacherid,
          };
          // Notify all parties
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
        .json({ message: "session has been successfully updated" });
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

exports.updatesession = async (req, res) => {
  const { id } = req.params;
  const { sessionName, term } = req.body;

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
    let allChanges = objectreducer(sessionDetail, { sessionName, term });
    // If  2 items changed, update all sessions with the same name and the current session
    if (allChanges.changeditems.length == 2) {
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
    res.status(200).json({ message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating session:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the session" });
  }
};
exports.viewsessions = async (req, res) => {
  const { username, userid, role } = req.payload;

  // Input validation
  if (!username || !userid || role === undefined) {
    return res.status(400).json({ message: "Invalid input parameters" });
  }

  try {
    const transaction = await sequelize.transaction();

    try {
      let results = [];

      if (role === 3) {
        // Query registration details for the student
        const query = `
          SELECT registration.id, categories.categoryName, registration.year, registration.session_id 
          FROM registration 
          LEFT JOIN categories ON registration.category_id = categories.id 
          WHERE regNo = ${username}
        `;
        const details = await Registration.sequelize.query(query, {
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

        // Query to get all sessions attended by the student
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
                WHERE user_id = ${studentDetails.id} AND session_id = ${session.id} 
                LIMIT 1
              `;
              const pastDetails = await Score.sequelize.query(
                pastDetailsQuery,
                {
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
      } else {
        // Fetch all sessions for other users
        results = await Sessions.findAll({ transaction });
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
