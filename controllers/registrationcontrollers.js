const { Op } = require("sequelize");
const Registration = require("../models/registration");
const Class = require("../models/class");
const { objectreducer } = require("./jwtgeneration");
const Sessions = require("../models/session");
const Activities = require("../models/activities");
const Subjects = require("../models/subjects");
const Registeredcourses = require("../models/registeredcourses.");
const { sequelize } = require("../models");
// Update your register function to accept dependencies
exports.register = async (
  req,
  res,
  { assignClass, notifyallparties, models }
) => {
  const { fname, lname, cate, dept, year, sex, session, DOB, email, address } =
    req.body;
  const { userid, username, role } = req.user;
  const {
    Categories,
    Subjects,
    Sessions,
    Registration,
    Activities,
    sequelize,
  } = models;
  try {
    const transaction = await sequelize.transaction();
    try {
      const cateYear = await Categories.findOne({
        where: { id: cate },
        attributes: ["years"],
        transaction,
      });

      if (!cateYear) {
        return res.status(404).json({ message: "Category not found" });
      }

      if (year > cateYear.years) {
        return res.status(400).json({
          message: "There is no such class in the category you've chosen",
        });
      }

      const compulsorySubjects = await Subjects.findAll({
        where: {
          category_id: cate,
          year: year,
          compulsory: true,
          [Op.or]: [{ department_id: dept }, { department_id: 0 }],
        },
        transaction,
      });
      const sessionName = await Sessions.findOne({
        where: { id: session },
        attributes: ["sessionName"],
        transaction,
      });

      if (!sessionName) {
        return res.status(404).json({ message: "Session not found" });
      }
      const lastRow = await Registration.findOne({
        order: [["id", "DESC"]],
        transaction,
      });
      const lastRowId = lastRow ? lastRow.id : 0;
      const main = { cate: cate, dept: dept, year: year };
      const choosenClass = await assignClass(main);
      if (year === 0) {
        const unadmitted = await Registration.findOne({
          where: { year: 0 },
          order: [["id", "DESC"]],
          transaction,
        });
        const refno = unadmitted ? unadmitted.id : 0;
        await Registration.create(
          {
            first_name: fname,
            last_name: lname,
            year: year,
            sex: sex,
            session_id: session,
            regNo: `${sessionName.sessionName.slice(0, 4)}${refno}`,
            DOB: DOB,
            email: email,
            address: address,
          },
          { transaction }
        );
      }

      const regNo = `${sessionName.sessionName.slice(0, 4)}${lastRowId}${
        choosenClass.classid
      }`;

      await Registration.create(
        {
          first_name: fname,
          last_name: lname,
          category_id: cate,
          department_id: dept,
          year: year,
          sex: sex,
          DOB: DOB,
          email: email,
          address: address,
          class_id: choosenClass.classid,
          session_id: session,
          regNo: regNo,
        },
        { transaction }
      );

      const activity = await Activities.create(
        {
          description: `${username} just registered a student`,
          performed_by: userid,
          createdAt: new Date(),
          role: role,
        },
        { transaction }
      );

      const dep = {
        classid: choosenClass.classid,
        subjects: compulsorySubjects,
        transaction: transaction,
        classmessage: "just registered a student to your class",
        subjectsmessage: "just registered a student to your subject",
        author: username,
        activity_id: activity.id,
        teacherid: choosenClass.teacher,
      };

      await notifyallparties(dep);

      await transaction.commit();

      return res.status(201).json({
        message: `Student has been successfully registered with registration number ${regNo} and in class ${choosenClass.classname}`,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error during registration:", error);
      return res.status(500).json({
        message: "An error occurred during registration",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error starting transaction:", error);
    return res.status(500).json({
      message: "An error occurred while starting the transaction",
      error: error.message,
    });
  }
};

exports.viewregister = async (req, res) => {
  const { class_id, subject_id } = req.params;
  try {
    const transaction = await sequelize.transaction();
    try {
      let students = null;
      if (class_id) {
        students = await Registration.findAll(
          {
            where: { class_id: class_id },
            attributes: ["first_name", "last_name", "sex"],
          },
          { transaction }
        );
      }
      if (subject_id) {
        let detail = Subjects.findOne({ where: { id: subject_id } });
        if (detail.compulsory === true) {
          students = await Registration.findAll(
            {
              where: {
                category_id: detail.category_id,
                department_id: detail.department_id,
                year: detail.year,
              },
              attributes: ["regno", "first_name", "last_name", "sex"],
            },
            { transaction }
          );
        } else {
          const currentsession = Sessions.findOne({ where: { status: 1 } });
          const query = `select first_name,last_name,sex from registration left join registeredcourses on registration.id=registeredcourses.student_id where sessionName=${currentsession.sessionName} and subject_id=${subject_id}`;
          students = await Registeredcourses.sequelize.query(
            query,
            {
              type: sequelize.QueryTypes.SELECT,
            },
            { transaction }
          );
        }
      }
      // to view unadmitted student
      if (class_id === 0) {
      }
      if (students.length > 0) {
        await transaction.commit();
        return res.status(200).json({ data: students });
      } else {
        await transaction.commit();
        return res.status(404).json({
          message: "there is no students registered to this class or subject",
        });
      }
    } catch (error) {
      // Rollback the transaction in case of any error
      await transaction.rollback();
      console.error(error);
      return res
        .status(500)
        .json({ message: "An error occurred during the viewing process" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
exports.updateregister = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    category_id,
    department_id,
    year,
    sex,
    session,
    DOB,
    email,
    address,
    parent,
  } = req.body;

  try {
    const transaction = await sequelize.transaction();
    try {
      const Student = await Registration.findOne({
        where: { id },
        transaction,
      });

      const Session = await Sessions.findOne({
        where: { id: session },
        transaction,
      });

      if (!Student) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "No student found for the given ID." });
      }

      if (!Session) {
        await transaction.rollback();
        return res
          .status(404)
          .json({ message: "No session found for the given ID." });
      }

      const incomingChanges = {
        first_name,
        last_name,
        category_id,
        department_id,
        year,
        sex,
        session,
        DOB,
        email,
        address,
        parent,
      };

      const allchanges = objectreducer(Student, incomingChanges);

      if (
        allchanges.changeditems.includes("category_id") &&
        allchanges.changeditems.includes("department_id")
      ) {
        const main = { cate: category_id, dept: department_id, year: year };
        const choosenClass = await assignClass(main);

        const compulsorySubjects = await Subjects.findAll({
          where: {
            category_id: allchanges.newobject.category_id,
            year: allchanges.newobject.year,
            [op.or]: [
              { department_id: allchanges.newobject.department_id },
              { department_id: 0 },
            ],
          },
          transaction,
        });

        if (Student.year === 0) {
          const lastRow = await Registration.findOne({
            order: [["id", "DESC"]],
            transaction,
          });

          const lastID = lastRow ? lastRow.id : 0;
          const regNo = `${Session.sessionName.slice(0, 4)}${lastID}${
            choosenClass.classid
          }`;

          allchanges.newobject.regNo = regNo;

          await Registration.update(allchanges.newobject, {
            where: { id },
            transaction,
          });

          const activity = await Activities.create(
            {
              description: `${req.payload.username} just admitted a student`,
              performed_by: req.payload.userid,
              createdAt: new Date(),
              role: req.payload.role,
            },
            { transaction }
          );

          const dep = {
            classid: choosenClass.classid,
            subjects: compulsorySubjects,
            transaction: transaction,
            classmessage: "just registered a student to your class",
            subjectsmessage: "just registered a student to your subject",
            author: req.payload.username,
            activity_id: activity.id,
            teacherid: choosenClass.teacher,
          };

          await notifyallparties(dep);
          await transaction.commit();

          return res.status(200).json({
            message: `Student ${Student.first_name} ${Student.last_name} has been successfully updated`,
          });
        } else {
          const formercls = Student.class_id;
          const formerclsdetail = await Class.findOne({
            where: { id: formercls },
            transaction,
          });

          const allprevcourse = await Subjects.findAll({
            where: { category_id: Student.category_id, year: Student.year },
            transaction,
          });

          const prevregisteredcourse = await Registeredcourses.findAll({
            where: { sessionName: Session.sessionName, student_id: id },
            transaction,
          });

          const formercourses = allprevcourse.filter(
            (detail) =>
              detail.department_id === Student.department_id ||
              detail.department_id === 0 ||
              (prevregisteredcourse.length > 0 &&
                prevregisteredcourse.some(
                  (course) => course.subject_id === detail.id
                ))
          );

          allchanges.newobject.class_id = choosenClass.classid;
          await Registration.update(allchanges.newobject, {
            where: { id },
            transaction,
          });

          const activity = await Activities.create(
            {
              description: `${req.payload.username} just updated a student changing class`,
              performed_by: req.payload.userid,
              createdAt: new Date(),
              role: req.payload.role,
            },
            { transaction }
          );

          const deps = [
            {
              classid: formercls,
              subjects: formercourses,
              transaction: transaction,
              classmessage: "just removed a student from your class",
              subjectsmessage: `stopped ${Student.first_name} ${Student.last_name} from taking your subject`,
              author: req.payload.username,
              activity_id: activity.id,
              teacherid: formerclsdetail.teacherid,
            },
            {
              classid: choosenClass.classid,
              subjects: compulsorySubjects,
              transaction: transaction,
              classmessage: "just registered a student to your class",
              subjectsmessage: `a new student is now taking your subject`,
              author: req.payload.username,
              activity_id: activity.id,
              teacherid: choosenClass.teacher,
            },
          ];

          await Promise.all(deps.map((dep) => notifyallparties(dep)));
          await transaction.commit();

          return res.status(200).json({
            message: `Student ${Student.first_name} ${Student.last_name} has been successfully updated`,
          });
        }
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Error during the updating process:", error);
      return res.status(500).json({
        message: "An error occurred during the update process",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Transaction start error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error unable to start a transaction" });
  }
};
