const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Sessions = require("../models/session");
const Teachers = require("../models/teachers");
const Users = require("../models/users");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { objectreducer } = require("./jwtgeneration");
const bcrypt = require("bcrypt");
const Class = require("../models/class");
const Subjects = require("../models/subjects");
const externalUploadDir = path.join(__dirname, "..", "uploads", "users");
exports.addteacher = async (req, res) => {
  const {
    fname,
    lname,
    email,
    phoneNo,
    address,
    category_id,
    department_id,
  } = req.body;

  let staff_id = req.body.staff_id; // Ensure this is provided or calculated
  const file = req.file; // Get the file from multer
  console.log(file);
  let transaction;
  try {
    transaction = await sequelize.transaction();

    // Compute the staff_id if not provided
    if (!staff_id) {
      const lastRow = await Teachers.findOne({
        order: [["id", "DESC"]],
        transaction,
      });

      const sessionName = await Sessions.findOne({
        where: { active: true },
        attributes: ["sessionName"],
        transaction,
      });

      if (!sessionName) {
        await transaction.rollback();
        return res.status(404).json({ message: "Session not found" });
      }

      const lastRowId = lastRow ? lastRow.id : 0;
      const computedStaffId = `${sessionName.sessionName.slice(0, 4)}${lastRowId}`;
      staff_id = computedStaffId; // Assign computed staff_id
    }

    // Save teacher record
    await Teachers.create(
      {
        fname,
        lname,
        email,
        phoneNo,
        address,
        category_id,
        department_id,
        staff_id, // Save computed staff_id
      },
      { transaction }
    );

    // Create user record
    const hashedPassword = await bcrypt.hash(fname, 10);
    await Users.create({
      email: email,
      password: hashedPassword,
      regNo: staff_id,
      role: category_id === 0 ? 1 : 2,
      img: staff_id,
    });

    // Handle file upload
    if (file) {
      const filePath = path.join(
        externalUploadDir,
        `${staff_id}${path.extname(file.originalname)}` // Use original extension
      );

      await new Promise((resolve, reject) => {
        fs.writeFile(filePath, file.buffer, (err) => {
          if (err) {
            console.error("Error saving file:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    await transaction.commit();
    return res.status(200).json({ message: "The teacher has been successfully registered" });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "An error occurred during registration" });
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
      const initialDetail = await Teachers.findOne({
        where: { id },
        transaction,
      });

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
        await Teachers.update(allchanges.newobject, {
          where: { id },
          transaction,
        });
        // Commit transaction
        await transaction.commit();
        return res.status(200).json({
          message: `The teacher's ${allchanges.changeditems} has been updated successfully`,
        });
      } else {
        // Logic when the category and department of the teacher is changed

        // Check the teacher's previous records
        const formercls = await Class.findOne({
          where: { teacherid: id },
          transaction,
        });
        const formersubjects = await Subjects.findAll({
          where: { teacherid: id },
          transaction,
        });

        await Teachers.update(allchanges.newobject, {
          where: { id },
          transaction,
        });

        if (formercls) {
          await Class.update(
            { teacherid: 0 },
            { where: { teacherid: id }, transaction }
          );
        }

        if (formersubjects.length > 0) {
          await Subjects.update(
            { teacherid: 0 },
            { where: { teacherid: id }, transaction }
          );
        }

        const allsubjects = formersubjects.map((subject) => subject.name);

        // Commit all transactions
        await transaction.commit();

        // Give a successful message with consequences of action
        return res.status(200).json({
          message: `Update was successful but ${allsubjects.join(", ")} and ${
            formercls?.name || "N/A"
          } have no teacher`,
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
