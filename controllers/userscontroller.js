const { typechecker, generateToken } = require("./jwtgeneration");
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
const Class = require("../models/class");
exports.loginuser = async (req, res) => {
  const { regno, password } = req.body;
  console.log({ regno, password });
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
      const token = generateToken(payload, { typechecker });
      return res.status(200).json({
        message: "login successfully",
        token: token,
        userdetail: payload,
      });
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
  const { id, searchrole } = req.params;

  // Start transaction
  const transaction = await sequelize.transaction();

  try {
    let result;

    if (id && id !== '0') {
      if (searchrole === '2') {
        const teacher = await Teachers.findOne({
          where: { id },
          attributes: ["fname", "lname", "email", "phoneNo", "address"],
          transaction,
        });

        const subjects = await Subjects.findAll({
          where: { teacherid: id },
          transaction,
        });

        const classes = await Class.findOne({
          where: { teacherid: id },
          transaction,
        });

        if (teacher) {
          await transaction.commit();
          return res.status(200).json({
            teacherdetail: teacher,
            totalsubjects: subjects.length,
            handling: classes ? classes.name : 'N/A',
          });
        } else {
          await transaction.rollback();
          return res.status(404).json({
            message: "No teacher found with such details in our database.",
          });
        }
      }

      if (searchrole === '3') {
        const query = `
          SELECT registration.first_name, registration.last_name, category.categoryName, departments.name as department,
          registration.year, registration.sex, registration.DOB, registration.email, registration.address,
          classes.name as class, session.sessionName as session
          FROM registration
          LEFT JOIN categories ON registration.category_id = categories.id
          LEFT JOIN departments ON registration.department_id = departments.id
          LEFT JOIN classes ON registration.class_id = classes.id
          LEFT JOIN sessions ON registration.session_id = sessions.id
          WHERE registration.id = :Id
        `;

        const studentdetails = await sequelize.query(query, {
          replacements: { Id: id },
          type: sequelize.QueryTypes.SELECT,
          transaction,
        });

        if (studentdetails.length > 0) {
          await transaction.commit();
          return res.status(200).json({ detail: studentdetails });
        } else {
          await transaction.rollback();
          return res.status(404).json({
            message: "No student fits such profile.",
          });
        }
      }
    } else {
      if (searchrole === '2') {
        result = await Teachers.findAll({
          attributes: ["fname", "lname", "staff_id"],
          transaction,
        });
      } else if (searchrole === '3') {
        result = await Registration.findAll({
          attributes: ["first_name", "last_name", "regNo"],
          transaction,
        });
      } else {
        result = [];
      }

      if (result.length > 0) {
        await transaction.commit();
        return res.status(200).json({ detail: result });
      } else {
        await transaction.commit();
        return res.status(404).json({
          message: searchrole === '3'
            ? "You've not registered any student to your database."
            : "You've not registered any teacher to your database.",
        });
      }
    }
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error);
    return res.status(500).json({
      message: "An error occurred during the transaction.",
    });
  }
};
exports.deleteuser = async (req, res) => {};
