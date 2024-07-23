const { generateToken } = require("./jwtgeneration");
const { sequelize } = require("../models");
const Registration = require("../models/registration");
const Registeredcourses = require("../models/registeredcourses.");
const Teachers = require("../models/teachers");
const TestControl = require("../models/testcontrol");
const Sessions = require("../models/session");
const Score = require("../models/scores");
const Users = require("../models/users");
const bcrypt = require("bcrypt");
const Subjects = require("../models/subjects");
exports.loginuser = async (req, res) => {
  const { regno, password } = req.body;
  console.log({ regno, password })
  try {
    // Attempt to find the user in the database
    const detail = await Users.findOne({ where: { regNo: regno } });

    // Check if user exists
    if (!detail) {
      return res.status(400).json({ message: "there is no such username" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, detail.password);
    // this is for cass where the password was encrypted and when it wasn't encrypted before being stored in the database
    if (isMatch || password === detail.password) {
      //generation of token for the user
      const payload = {
        userid: detail.id,
        username: detail.regNo,
        role: detail.role,
      };
      const token = generateToken(payload);
      return res
        .status(200)
        .json({ message: "login successfully", token: token,role:payload['role'] });
    } else {
      // Handle incorrect password case
      return res.status(401).json({ message: "incorrect password" });
    }
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

exports.cbtlogin = async (req, res) => {
  const { regNo, fname, session_id } = req.body;
  const query = `
    SELECT 
      subjects.id as subject_id,
      category_id,
      department_id,
      name,
      compulsory,
      description,
      duration,
      type 
    FROM subjects 
    LEFT JOIN testcontrol 
    ON subjects.id = testcontrol.subject_id 
    WHERE testcontrol.session_id = :session_id 
    AND testcontrol.status = 1`;
  // to intiate a transaction
  const transaction = await sequelize.transaction();
  try {
    // to get the student's detail
    const Student = await Registration.findOne(
      { where: { regNo } },
      { transaction }
    );
    // to get the current's session detail
    const session = await Sessions.findOne(
      { where: { id: session_id } },
      { transaction }
    );
    // if student is not found respond with error
    if (!Student) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "There is no such student in our database" });
    }
    // where firstname don't match
    if (Student.first_name !== fname) {
      await transaction.rollback();
      return res.status(400).json({ message: "First name does not match" });
    }
    // to get all active exams for the session
    const alltest = await TestControl.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { session_id },
      transaction,
    });
    // when there's no active exams
    if (alltest.length === 0) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "There is no test yet for this current session" });
    }
    // get the users preference
    const userselections = await Registeredcourses.findAll({
      where: {
        student_id: Student.id,
        sessionName: session.sessionName,
      },
      transaction,
    });
    // get all the user's releveant tests
    const userTest = alltest.filter(
      (detail) =>
        (detail.category_id === Student.category_id &&
          detail.department_id === Student.department_id &&
          detail.compulsory === 1) ||
        (userselections.length > 0 &&
          userselections.some(
            (course) => course.subject_id === detail.subject_id
          ))
    );
    // when there's no relevant test for the user
    if (userTest.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: "No matching tests found" });
    }
    // instantiate an array to contain all taken test
    const donetest = [];
    for (const test of userTest) {
      const teststatus = await Score.findOne({
        where: {
          user_id: Student.id,
          session_id: session_id,
          subject_id: test.subject_id,
        },
        transaction,
      });

      if (test.type === "exam" && teststatus.exam_status === 1) {
        donetest.push(test.subject_id);
      } else if (test.type === "test" && teststatus.CA_status === 1) {
        donetest.push(test.subject_id);
      } else {
        await transaction.commit();
        return res.status(200).json({
          message: test.description,
          duration: test.duration,
          type: test.type,
          subject: test.name,
          subject_id: test.subject_id,
        });
      }
    }

    await transaction.commit();
    if (donetest.length === userTest.length) {
      return res.status(200).json({
        message: "Our database shows that you've done all your exams for now",
      });
    } else {
      return res.status(200).json({
        message: "There are tests pending",
        pendingTests: userTest.filter(
          (test) => !donetest.includes(test.subject_id)
        ),
      });
    }
  } catch (error) {
    await transaction.rollback();
    console.error("error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.viewuser = async (req, res) => {
  const { id } = req.params;
  const { searchrole, session_id } = req.body;
  const { user_id, username, role } = req.payload;

  try {
    const transaction = await sequelize.transaction();
    try {
      if (id) {
        if (searchrole === 2) {
          const teacher = await Teachers.findOne({
            where: { id },
            transaction,
          });
          if (teacher) {
            await transaction.commit();
            return res.status(200).json({ teacher });
          } else {
            await transaction.rollback();
            return res.status(404).json({
              message: "No teacher found with such details in our database.",
            });
          }
        }

        if (searchrole === 3) {
          const student = await Registration.findOne({
            where: { id },
            transaction,
          });
          if (student) {
            await transaction.commit();
            return res.status(200).json({ student });
          } else {
            await transaction.rollback();
            return res
              .status(404)
              .json({ message: "No student fits such profile." });
          }
        }
      }

      if (user_id && role === 3 && session_id) {
        const profile = await Registration.findOne({
          where: { regNo: username },
          transaction,
        });
        const sessionDetail = await Sessions.findOne({
          where: { id: session_id },
          transaction,
        });

        if (!sessionDetail) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "There is no such session in our database." });
        }

        const electedCourses = await Registeredcourses.findAll({
          where: {
            student_id: profile.id,
            sessionName: sessionDetail.sessionName,
          },
          transaction,
        });

        const query = `
          SELECT subjects.name as subject, teachers.fname as firstname, subjects.category_id, 
                 subjects.department_id, subjects.compulsory, teachers.lname as lastname 
          FROM subjects 
          LEFT JOIN teachers ON subjects.teacherid = teachers.id 
          WHERE subjects.category_id = ${profile.category_id} 
            AND subjects.year = ${profile.year};
        `;

        const allSubjects = await Subjects.sequelize.query(query, {
          type: sequelize.QueryTypes.SELECT,
          transaction,
        });

        if (allSubjects.length > 0) {
          const specificSubjects = allSubjects.filter(
            (detail) =>
              (detail.department_id === profile.department_id ||
                detail.department_id === 0) &&
              detail.compulsory === true &&
              electedCourses.length > 0 &&
              electedCourses.some((course) => course.subject_id === detail.id)
          );

          await transaction.commit();
          return res.status(200).json({ subject_teachers: specificSubjects });
        } else {
          await transaction.rollback();
          return res.status(404).json({
            message: "Your category has no subject offered under it.",
          });
        }
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Error:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during the transaction." });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
exports.deleteuser = async (req, res) => {};
