const { Sessions } = require("../models/session");
const { Teachers } = require("../models/teachers");
const { Users } = require("../models/users");
const { sequelize } = require("../models");
const { Op } = require("sequelize");
const { objectreducer } = require("./jwtgeneration");
const bcrypt = require("bcrypt");
const { Class } = require("../models/class");
const { Subjects } = require("../models/subjects");

const externalUploadDir = `C:\\Users\\KELVIN\\Documents\\portalfrontend\\src\\components\\img\\users`;

const upload = createUploadMiddleware(externalUploadDir);
exports.addteacher = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

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

    const staff_id = req.body.staff_id; // Ensure this is provided or calculated
    try {
      const transaction = await sequelize.transaction();
      try {
        const lastRow = await Teachers.findOne({
          order: [["id", "DESC"]],
          transaction,
        });

        const sessionName = await Sessions.findOne({
          where: { id: session_id },
          attributes: ["sessionName"],
          transaction,
        });

        if (!sessionName) {
          await transaction.rollback();
          return res.status(404).json({ message: "Session not found" });
        }

        const lastRowId = lastRow ? lastRow.id : 0;
        const computedStaffId = `${sessionName.sessionName.slice(
          0,
          4
        )}${lastRowId}`;

        // Create the teacher record with staff_id
        await Teachers.create(
          {
            fname,
            lname,
            email,
            phoneNo,
            address,
            category_id,
            department_id,
            staff_id: computedStaffId, // Save computed staff_id
          },
          { transaction }
        );

        // Create the user record
        const hashedPassword = await bcrypt.hash(fname, 10);
        await Users.create({
          email: email,
          password: hashedPassword,
          regNo: computedStaffId,
          role: category_id === 0 ? 1 : 2,
        });

        await transaction.commit();

        // Rename the file to match the staff_id
        if (req.file) {
          const oldPath = req.file.path;
          const newPath = path.join(
            externalUploadDir,
            `${computedStaffId}${path.extname(req.file.originalname)}`
          );
          fs.renameSync(oldPath, newPath);
        }

        return res
          .status(200)
          .json({ message: "The teacher has been successfully registered" });
      } catch (error) {
        await transaction.rollback();
        console.error("Error during registration:", error);
        return res
          .status(500)
          .json({ message: "An error occurred during registration" });
      }
    } catch (error) {
      console.error("Error starting transaction:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
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
