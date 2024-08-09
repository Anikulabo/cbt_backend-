const teacherselect = require("./jwtgeneration");
const Subjects = require("../models/subjects");
const { where } = require("sequelize");
exports.addsubject = async (
  req,
  res,
  { models, io, notifyauser, typechecker }
) => {
  const {
    name, // expect a string
    categories, // expect an array of numbers
    departments, // expect an object of form {cate_name: an integer}
    teachers: teachersInput, // expect an object of the form {cate_name: an array of integer}
    compulsory, // expect an object of the form {cate_name: boolean}
  } = req.body;
  const { Subjects, sequelize, Categories, Notifications, Activities } = models;

  try {
    const transaction = await sequelize.transaction();
    try {
      const teachersMap = {};
      const unmannedsubject = [];
      for (const category of categories) {
        const cate_detail = await Categories.findOne({
          where: { id: category },
          transaction,
        });
        if (!cate_detail) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "No category matches your description" });
        }

        const dept = departments[cate_detail.categoryName];
        const cateName = cate_detail.categoryName;

        for (let year = 1; year <= cate_detail.year; year++) {
          const selectedteacher = teachersInput[cateName]
            ? await teacherselect({
                teacherids: teachersInput[cateName],
                Subjects,
                transaction,
              })
            : 0;
          let detail = await Subjects.create(
            {
              year,
              category_id: category,
              department_id: dept,
              teacherid: selectedteacher,
              compulsory: compulsory[cateName],
              name: name,
            },
            { transaction }
          );
          if (selectedteacher === 0) {
            unmannedsubject.push(detail.id);
          } else {
            if (teachersMap[selectedteacher]) {
              teachersMap[selectedteacher].push(detail.id);
            } else {
              teachersMap[selectedteacher] = [detail.id];
            }
          }
        }

        for (const [key, value] of Object.entries(teachersMap)) {
          await notifyauser(
            {
              description: `You've been assigned to teach ${value.length} subjects. Check portal for more details.`,
              performed_by: 0,
              roleOfperformer: 0,
              transaction: transaction,
              recipient: parseInt(key),
              roleOfrecipient: 2,
            },
            { typechecker, Activities, Notifications, io }
          );
        }
      }
      await transaction.commit();
      return res.status(200).json({
        message:
          unmannedsubject.length === 0
            ? "Subjects added successfully"
            : `Subjects added successfully. ${unmannedsubject.length} subjects still need teachers. View subjects for more details.`,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Inner transaction error:", error);
      return res
        .status(500)
        .json({ message: "Transaction could not complete" });
    }
  } catch (error) {
    console.error("Outer transaction error:", error);
    return res.status(500).json({ message: "Unable to start transaction" });
  }
};
exports.viewsuject = async (req, res, { models }) => {
  const { username, role } = req.user;
  const { sequelize, Registeredcourses, Registration, Sessions } = models;
  const { name, teacherid } = req.params;
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let query;
    let results;
    // Admin's case
    if (role === 1) {
      if (name !== "") {
        query = `
          SELECT subjects.id, teachers.fname as teacher, categories.categoryName, departments.name as department, subjects.year 
          FROM subjects 
          LEFT JOIN teachers ON subjects.teacherid = teachers.id 
          LEFT JOIN categories ON subjects.category_id = categories.id 
          LEFT JOIN departments ON subjects.department_id = departments.id 
          WHERE subjects.name = :name
        `;

        const teachersDetail = await sequelize.query(query, {
          replacements: { name },
          type: sequelize.QueryTypes.SELECT,
          transaction,
        });

        for (const item of teachersDetail) {
          let studentTakingCourse;

          const detailOfSubject = await Subjects.findOne({
            where: { id: item["id"] },
            transaction,
          });

          if (detailOfSubject["compulsory"]) {
            studentTakingCourse = await Registration.findAll({
              where: {
                category_id: detailOfSubject["category_id"],
                year: detailOfSubject["year"],
                ...(detailOfSubject["department_id"] !== 0 && {
                  department_id: detailOfSubject["department_id"],
                }),
              },
              transaction,
            });
          } else {
            const activeSession = await Sessions.findOne({
              where: { active: true },
              transaction,
            });

            studentTakingCourse = await Registeredcourses.findAll({
              where: {
                subject_id: item["id"],
                sessionName: activeSession["sessionName"],
              },
              transaction,
            });
          }

          item["student_taking_course"] = studentTakingCourse.length;
        }

        results = { name, teachersDetail };
      } else {
        const allSubjects = await Subjects.findAll({
          attributes: ["id", "name"],
          transaction,
        });

        results = [...new Set(allSubjects.map(({ name }) => name))];
      }
    }

    // Teacher's case
    else if (role === 2) {
      query = `
        SELECT subjects.name, categories.categoryName, subjects.year 
        FROM subjects 
        LEFT JOIN categories ON subjects.category_id = categories.id 
        WHERE subjects.teacherid = :teacherId 
        ORDER BY subjects.category_id ASC
      `;
      results = await sequelize.query(query, {
        replacements: { teacherId: teacherid },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      });
    }
    // Student's case
    else if (role === 3) {
      const student_detail = await Registration.findOne({
        where: { regNo: username },
        transaction,
      });
      const active_session = await Sessions.findOne({
        where: { active: true },
        transaction,
      });

      if (student_detail && active_session) {
        query = `
          SELECT subjects.id, subjects.name, subjects.year, subjects.department_id, subjects.compulsory, teachers.fname 
          FROM subjects 
          LEFT JOIN teachers ON subjects.teacherid = teachers.id 
          WHERE subjects.category_id = :categoryId
        `;
        const allSubjects = await sequelize.query(query, {
          replacements: { categoryId: student_detail["category_id"] },
          type: sequelize.QueryTypes.SELECT,
          transaction,
        });

        const electiveSubjects = await Registeredcourses.findAll({
          where: {
            student_id: student_detail["id"],
            sessionName: active_session["sessionName"],
          },
          attributes: ["subject_id"],
          transaction,
        });

        const studentsubjects = allSubjects
          .filter(
            (detail) =>
              (detail.year === student_detail["year"] &&
                (detail.department_id === student_detail["department_id"] ||
                  detail.department_id === 0) &&
                detail.compulsory === true) ||
              electiveSubjects.some((item) => item.subject_id === detail.id)
          )
          .map((content) => ({
            subject: content["name"],
            teacher: content["fname"],
          }));

        if (studentsubjects.length > 0) {
          await transaction.commit();
          return res.status(200).json({ data: studentsubjects });
        } else {
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "No subject matches your criteria" });
        }
      } else {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "Invalid student detail or no active session" });
      }
    }

    // Handle cases where no role matches
    else {
      await transaction.rollback();
      return res.status(403).json({ message: "Access denied" });
    }

    // Success response for admin and teacher roles
    if (results && results.length > 0) {
      await transaction.commit();
      return res.status(200).json({ data: results });
    } else {
      await transaction.rollback();
      return res.status(400).json({
        message: "There is no subject that matches your description",
      });
    }
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
