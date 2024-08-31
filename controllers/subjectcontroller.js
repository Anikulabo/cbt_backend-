const Subjects = require("../models/subjects");
const path = require("path");
const { teacherselect } = require("./jwtgeneration");
const fs = require("fs");
const { Sequelize } = require("sequelize");
function capitalize(str) {
  if (!str) return str; // Handle empty string or null
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
exports.addsubject = async (
  req,
  res,
  { models, io, notifyauser, typechecker }
) => {
  const {
    name,
    categories,
    departments,
    teachers: teachersInput,
    compulsory,
  } = req.body;

  // Parse the JSON strings into their respective objects or arrays
  let parsedCategories;
  let parsedDepartments;
  let parsedTeachers;
  let parsedCompulsory;

  try {
    // Handle categories being a JSON array or a comma-separated string
    if (typeof categories === "string") {
      parsedCategories = JSON.parse(categories);
      // If the parsing did not produce an array, try splitting by commas
      if (!Array.isArray(parsedCategories)) {
        parsedCategories = categories.split(",").map(Number);
      }
    } else {
      parsedCategories = categories;
    }

    // Validate that parsedCategories is an array
    if (!Array.isArray(parsedCategories)) {
      throw new TypeError("Parsed categories is not an array");
    }

    parsedDepartments = JSON.parse(departments); // Expecting this to be an object
    parsedTeachers = JSON.parse(teachersInput); // Expecting this to be an object
    parsedCompulsory = JSON.parse(compulsory); // Expecting this to be an object
  } catch (error) {
    console.error("Error parsing input:", error);
    return res.status(400).json({ message: "Invalid input format" });
  }

  const { Subjects, sequelize, Categories, Notifications, Activities } = models;
  const file = req.file ? req.file : undefined;
  const externalUploadDir = path.join(__dirname, "..", "uploads", "subjects");
  // Ensure the upload directory exists
  if (!fs.existsSync(externalUploadDir)) {
    fs.mkdirSync(externalUploadDir, { recursive: true });
  }

  try {
    // Start the outer transaction
    const transaction = await sequelize.transaction();

    try {
      const subjectsToCreate = [];
      const teachersMap = {};
      const unmannedsubject = [];

      for (const category of parsedCategories) {
        // Fetch category details
        const cate_detail = await Categories.findOne({
          where: { id: category },
          transaction,
        });

        if (!cate_detail) {
          // Rollback and return if category is not found
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "No category matches your description" });
        }

        const dept = parsedDepartments[cate_detail.categoryName];
        const cateName = cate_detail.categoryName;
        let allselectedteachers = [];
        for (let year = 1; year <= cate_detail.years; year++) {
          // Select teacher
          //console.log("Attributes:", Subjects.rawAttributes);
          // Outputs: "Subjects"

          let selectedteacher = parsedTeachers[capitalize(cateName)]
            ? await teacherselect({
                teacherids: parsedTeachers[capitalize(cateName)],
                Subjects,
                transaction,
                selected: allselectedteachers, // Pass the tracking array
              })
            : 0;
          allselectedteachers.push(selectedteacher);
          const subjectDetail = {
            year,
            category_id: category,
            department_id: dept,
            teacherid: selectedteacher,
            compulsory: parsedCompulsory[cateName],
            name: name,
          };

          subjectsToCreate.push(subjectDetail);

          if (selectedteacher === 0) {
            unmannedsubject.push(subjectDetail);
          } else {
            if (teachersMap[selectedteacher]) {
              teachersMap[selectedteacher].push(subjectDetail);
            } else {
              teachersMap[selectedteacher] = [subjectDetail];
            }
          }
        }
      }

      // Bulk create subjects
      const createdSubjects = await Subjects.bulkCreate(subjectsToCreate, {
        transaction,
      });
      // Notify teachers
      for (const [key, value] of Object.entries(teachersMap)) {
        const years_to_teach=value.map((item)=>item.year)
        await notifyauser(
          {
            description: `You've been assigned to teach ${name}  within years: ${years_to_teach.join(", ")}. Check portal for more details.`,
            performed_by: 0,
            roleOfperformer: 0,
            transaction: transaction,
            recipient: parseInt(key),
            roleOfrecipient: 2,
          },
          { typechecker, Activities, Notifications, io }
        );
      }

      // Handle file upload
      if (file) {
        //console.log(file)
        const filePath = path.join(
          externalUploadDir,
          `${name}${path.extname(file.originalname)}` // Use original extension
        );

        await new Promise((resolve, reject) => {
          fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
              console.error("Error saving file:", err);
              reject(err);
            } else {
              console.log("File path:", filePath);
              console.log("successfully saved")
              resolve();
            }
          });
        });
      }

      // Commit the transaction
      await transaction.commit();

      // Return success message
      return res.status(200).json({
        message:
          unmannedsubject.length === 0
            ? "Subjects added successfully"
            : `Subjects added successfully. ${unmannedsubject.length} subjects still need teachers. View subjects for more details.`,
      });
    } catch (error) {
      // Rollback on inner transaction error
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
          transaction,
        });

        results = [
          ...new Set(
            allSubjects.map((item) => {
              return item;
            })
          ),
        ];
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
