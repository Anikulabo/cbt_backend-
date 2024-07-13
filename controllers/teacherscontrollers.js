const { Sessions } = require("../models/session");
const { Teachers } = require("../models/teachers");
const { Users } = require("../models/users");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const {objectreducer}=require('./jwtgeneration');
const bcrypt = require('bcrypt');
const { Class } = require("../models/class");
const { Subjects } = require("../models/subjects");
exports.addteacher = async (req, res) => {
  const {
    fname,
    lname,
    email,
    phoneNo,
    address,
    category_id,
    department_id,
    session_id,
  } = req.body;
  try {
    const transaction = await sequelize.transaction();
    try {
      const lastRow = await Teachers.findOne({
        order: [["id", "DESC"]],
        transaction,
      });
      const sessionName = await Sessions.findOne({
        where: { id: session_id },
        attributies: ["sessionName"],
      });
      const lastRowId = lastRow ? lastRow.id : 0; // Default to 0 if no rows found
      const staff_id = `${sessionName.slice(0, 4)}${lastRowId}`;
      let role = null;
      if (category_id === 0) {
        // then it is  the head teacher
        role = 1;
      }
      await Teachers.create(
        {
          fname,
          lname,
          email,
          phoneNo,
          address,
          category_id,
          department_id,
          staff_id,
        },
        { transaction }
      );
      const hashedPassword = await bcrypt.hash(fname, 10);
      await Users.create({
        email: email,
        password: hashedPassword,
        regNo: staff_id,
        role: 2,
      });
      await transaction.commit();
      return res
        .status(200)
        .json({ message: "the teacher as been successfully registered" });
    } catch (error) {
      await transaction.rollback();
      return res
        .status(500)
        .json({ message: "an error occured during registration" });
    }
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
exports.viewteachers = async (req, res) => {
  const { category_id, department_id } = req.params;
  // SQL query to select various details from the 'teachers' table and join with 'subjects' and 'classes' tables
  let query = `SELECT teachers.id, teachers.fname, teachers.lname, teachers.email, teachers.phoneNo, subjects.name as subject, classes.name as class 
FROM teachers 
LEFT JOIN subjects on teachers.id = subjects.teacherid 
LEFT JOIN classes on teachers.id = classes.teacherid`;

  let teachers = [];

  // If a department_id is provided, modify the query to filter by department_id
  if (department_id) {
    query = `${query} WHERE teachers.department_id = ${department_id}`;
  }

  // If a category_id is provided and department_id is 0, modify the query to filter by category_id
  if (category_id && department_id === 0) {
    query = `${query} WHERE teachers.department_id = ${category_id}`;
  }

  try {
    // Execute the query and store the results
    const results = await Teachers.sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    if (results.length > 0) {
      // Use a Set to collect unique teacher ids
      let uniqueIds = new Set(results.map((result) => result.id));

      // Iterate over each unique teacher id
      for (const id of uniqueIds) {
        // Filter results to get subjects taken by the current teacher
        const subject_taken = results
          .filter((detail) => detail.id === id)
          .map((info) => info.subject);

        // Get the details of the current teacher
        const element_detail = results.find((item) => item.id === id);

        // Add the teacher's information to the 'teachers' array
        teachers.push({
          id: element_detail.id,
          fullname: `${element_detail.fname} ${element_detail.lname}`,
          taking: subject_taken.length,
          handlingClass: element_detail.class,
        });
      }
      // Send the response with the 'teachers' data
      return res.status(200).json({ data: teachers });
    }
  } catch (error) {
    // Handle any errors that occurred during the query execution
    console.error("Error executing query:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.deleteteachers = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await sequelize.transaction();
    try {
      const query = `
        SELECT subjects.name, subjects.year, categories.categoryName, departments.name AS department
        FROM subjects
        LEFT JOIN categories ON subjects.category_id = categories.id
        LEFT JOIN departments ON subjects.department_id = departments.id
        WHERE teacherid = :id
      `;
      const subjectref = await sequelize.query(query, {
        replacements: { id },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      });

      const classref = await Class.findAll({
        where: { teacherid: id },
        transaction,
      });

      if (subjectref.length > 0 || classref.length > 0) {
        await Teachers.destroy({ where: { id }, transaction });
        await Subjects.update(
          { teacherid: 0 },
          { where: { teacherid: id }, transaction }
        );
        await Class.update(
          { teacherid: 0 },
          { where: { teacherid: id }, transaction }
        );

        const classname = classref.map((element) => ({ name: element.name }));

        await transaction.commit();

        return res.status(200).json({
          message: "The teacher has been successfully deleted",
          subjects: subjectref,
          class: classname,
        });
      } else {
        await transaction.rollback();
        return res.status(404).json({
          message: "Teacher not found or no related subjects/classes.",
        });
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Error during deletion:", error);
      return res.status(500).json({
        message: "An error occurred in the process",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
exports.updateteacher = async (req, res) => {
  const { id } = req.params;
  const {
    fname,
    lname,
    email,
    phoneNo,
    address,
    category_id,
    department_id,
    session_id,
  } = req.body;

  try {
    const transaction = await sequelize.transaction();
    try {
      // Get the initial info of the teacher
      const initialDetail = await Teachers.findOne(
        { where: { id }, transaction }
      );

      const incomingChanges = {
        fname,
        lname,
        email,
        phoneNo,
        address,
        category_id,
        department_id,
        session_id,
      };

      // Compare the initial with the incoming data and filter only changed entries
      const allchanges = objectreducer(initialDetail, incomingChanges);

      // If category and department are not among the changes
      if (
        !allchanges.changeditems.includes("category_id") &&
        !allchanges.changeditems.includes("department_id")
      ) {
        await Teachers.update(allchanges.newobject, { where: { id }, transaction });
        // Commit transaction
        await transaction.commit();
        return res
          .status(200)
          .json({
            message: `The teacher's ${allchanges.changeditems} has been updated successfully`,
          });
      } else {
        // Logic when the category and department of the teacher is changed

        // Check the teacher's previous records
        const formercls = await Class.findOne(
          { where: { teacherid: id }, transaction }
        );
        const formersubjects = await Subjects.findAll(
          { where: { teacherid: id }, transaction }
        );

        await Teachers.update(allchanges.newobject, { where: { id }, transaction });
        
        if (formercls) {
          await Class.update({ teacherid: 0 }, { where: { teacherid: id }, transaction });
        }

        if (formersubjects.length > 0) {
          await Subjects.update({ teacherid: 0 }, { where: { teacherid: id }, transaction });
        }

        const allsubjects = formersubjects.map((subject) => subject.name);

        // Commit all transactions
        await transaction.commit();

        // Give a successful message with consequences of action
        return res
          .status(200)
          .json({
            message: `Update was successful but ${allsubjects.join(', ')} and ${formercls?.name || 'N/A'} have no teacher`,
          });
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Error during the updating process:", error);
      return res.status(500).json({
        message: "An error occurred during the process",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

