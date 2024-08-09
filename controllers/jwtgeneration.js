const express = require("express");
const dotenv = require("dotenv");
const Registration = require("../models/registration.js");
const Notifications = require("../models/notification.js");
const { Server } = require("socket.io");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Class = require("../models/class.js");
const app = express();
const { createServer } = require("http");
const server = createServer(app);
exports.io = new Server(server);
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
exports.generateToken = (mainpayload, { typechecker }) => {
  const { userid, username, role } = mainpayload;
  try {
    // Use typechecker to validate the payload
    typechecker({ userid, username, role }, [
      { key: "userid", type: "number" },
      { key: "username", type: "string" },
      { key: "role", type: "number" }, // Assuming role is a string, update if necessary
    ]);

    // Ensure JWT secret key is available
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error(
        "JWT_SECRET_KEY is not defined in the environment variables."
      );
    }

    // Define expiration and payload
    const expiration = "1h";
    const payload = { userid, username, role };

    // Generate the JWT token
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: expiration });
    return token;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred during token generation");
  }
};
exports.assignClass = async (main) => {
  // ------- test the attribute of the function------------

  // this is to accept the incoming expected keys from the attribute
  let keys = [];
  // expected key that should be in the attribute of the function
  const expectedkeys = ["cate", "dept", "year"];

  for (let [key, value] of Object.entries(main)) {
    // throw error if key is not expected
    if (!expectedkeys.includes(key)) {
      throw new Error(`unknown key ${key}`);
    }
    // throw error if value of key is not a number
    if (typeof value !== "number") {
      throw new Error(
        `expects a number in key ${key} received a ${typeof value}`
      );
    }
    // accept key if all is well
    keys.push(key);
  }

  // check if the accepted key is up to three
  if (keys.length < 3) {
    for (const key of expectedkeys) {
      // Use 'of' instead of 'in'
      if (!keys.includes(key)) {
        throw new Error(`expect three keys but you are missing key ${key}`);
      }
    }
  } else {
    const { cate, dept, year } = main;
    let choosenClass = { classid: null, classname: null, teacher: null };

    // Fetch available classes based on the criteria
    let classesAvailable = await Class.findAll({
      where: { category_id: cate, department_id: dept, year: year },
    });
    // If no classes are found, throw an error
    if (classesAvailable.length === 0) {
      throw new Error("There is no class that meets such requirement");
    }

    // If only one class is available, select it
    if (classesAvailable.length === 1) {
      choosenClass.classid = classesAvailable[0].id;
      choosenClass.classname = classesAvailable[0].name;
      choosenClass.teacher = classesAvailable[0].teacherid;
      return choosenClass;
    } else {
      // If multiple classes are available, find the class with the least students
      const studentsInClass = await Promise.all(
        classesAvailable.map(async (cls) => {
          const students = await Registration.findAll({
            where: { class_id: cls.id },
            attributes: ["class_id"],
          });
          return {
            students: students.length,
            class: cls.id,
            teacher: cls.teacherid,
          };
        })
      );

      // Find the class with the minimum number of students
      const totalStudents = studentsInClass.map((student) => student.students);
      const lowestPop = Math.min(...totalStudents);
      const detail = studentsInClass.find(
        (detail) => detail.students === lowestPop
      );

      // Assign the class details to the chosenClass object
      choosenClass.classid = detail.class;
      choosenClass.classname = classesAvailable.find(
        (cls) => cls.id === choosenClass.classid
      ).name;
      choosenClass.teacher = detail.teacher;
      return choosenClass;
    }
  }
};
exports.generalauthentication = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token.split(" ")[1], jwtSecretKey, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = payload;
    next();
  });
};
exports.adminauthentication = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token.split(" ")[1], jwtSecretKey, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    if (payload.role !== 1) {
      return res
        .status(403)
        .json({ error: "you are not authorized to view this data" });
    }
    req.user = payload;
    next();
  });
};
exports.findMinValue = (arr) => {
  if (arr.length === 0) {
    throw new Error("Array is empty");
  }
  return Math.min(...arr);
};
exports.notifyAllParties = async (dep) => {
  const expectedkeys = [
    { key: "classid", type: "number" },
    { key: "subjects", type: "array" },
    { key: "transaction", type: "object" },
    { key: "classmessage", type: "string" },
    { key: "subjectsmessage", type: "string" },
    { key: "author", types: ["string", "number"] }, // Modified to handle multiple types
    { key: "activity_id", type: "number" },
    { key: "teacherid", type: "number" },
  ];

  const goodkeys = [];

  for (let [key, value] of Object.entries(dep)) {
    const match = expectedkeys.find((item) => item.key === key);
    if (!match) {
      throw new Error(`You have an unexpected key ${key}`);
    }

    // Check for arrays
    if (match.type === "array" && !Array.isArray(value)) {
      console.log(value);
      throw new Error(
        `Expected an array as ${key}, received a ${typeof value}`
      );
    }
    // Check for multiple types
    if (match.types) {
      if (!match.types.includes(typeof value)) {
        throw new Error(
          `Expected one of [${match.types.join(
            ", "
          )}] as ${key}, received a ${typeof value}`
        );
      }
    } else if (match.type !== typeof value && match.type !== "array") {
      throw new Error(
        `Expected a ${match.type} as ${key}, received a ${typeof value}`
      );
    }

    goodkeys.push(key);
  }

  if (goodkeys.length < expectedkeys.length) {
    let missingkeys = expectedkeys
      .filter((detail) => !goodkeys.includes(detail.key))
      .map((item) => item.key);
    throw new Error(`You are missing keys: ${missingkeys.join(", ")}`);
  } else {
    const {
      classid,
      subjects = [], // Ensure subjects is always an array
      transaction,
      classmessage,
      subjectsmessage,
      author,
      activity_id,
      teacherid,
    } = dep;
    try {
      // Notify class teacher
      if (classid) {
        this.io.to(`class_${classid}`).emit(`${author} ${classmessage}`);
        await Notifications.create(
          {
            activity_id: activity_id,
            to: teacherid,
            type: 2,
            seen: false,
          },
          { transaction }
        );
      }

      // Notify subject teachers
      if (subjects.length > 0) {
        const promises = subjects.map((subject) => {
          this.io
            .to(`subject_${subject.id}`)
            .emit(`${author} ${subjectsmessage}`);
          return Notifications.create(
            {
              activity_id: activity_id,
              to: subject.teacherid,
              type: 2,
              seen: false,
            },
            { transaction }
          );
        });

        await Promise.all(promises);
      }
      await transaction.commit();
      return { message: "Notifications sent successfully" };
    } catch (error) {
      await transaction.rollback();
      console.error("Notification Error:", error); // Log the error for debugging
      throw new Error("Unable to notify some teachers");
    }
  }
};
exports.objectreducer = (prev, current) => {
  const changes = [];
  // Check if both arguments are non-null objects
  if (
    typeof prev !== "object" ||
    prev === null ||
    typeof current !== "object" ||
    current === null
  ) {
    throw new Error("Both arguments must be non-null objects");
  }

  // Ensure prev has a toJSON method
  if (typeof prev.toJSON !== "function") {
    throw new Error("The first argument must have a toJSON method");
  }

  // Convert prev object to JSON
  const prevJSON = prev.toJSON();

  // Compare the initial with the incoming data
  for (let [key, value] of Object.entries(prevJSON)) {
    let currentValue = current[key];
    if (currentValue !== undefined && currentValue !== value) {
      changes.push(key);
    }
  }

  // Filter current object to get only the updated entries
  const updatedEntries = Object.fromEntries(
    Object.entries(current).filter(([key]) => changes.includes(key))
  );

  return { newobject: updatedEntries, changeditems: changes };
};
exports.typechecker = (incomingobject, expectedkeys) => {
  // An array to accept the good keys
  const goodkeys = [];

  // Check if expectedkeys is an array
  if (!Array.isArray(expectedkeys)) {
    throw new Error(
      "The second parameter should be an array of objects with key-value pairs of 'key' and 'type'."
    );
  }

  // Check for any abnormalities in the expectedkeys array
  const abnormality = expectedkeys.find(
    (detail) =>
      !detail.key ||
      !detail.type ||
      (typeof detail.type !== "string" && !Array.isArray(detail.type))
  );
  if (abnormality) {
    throw new Error(
      `Abnormal key: ${JSON.stringify(
        abnormality
      )}. We need an array of objects with keys ['key', 'type'] as the second parameter, and both key and type must be strings.`
    );
  }

  // Check if incomingobject is a valid object
  if (
    typeof incomingobject !== "object" ||
    incomingobject === null ||
    Array.isArray(incomingobject)
  ) {
    throw new Error(
      `The first parameter should be a non null object, but you provided a ${typeof incomingobject} or a null object.`
    );
  }

  // Iterate over the keys and values of the incoming object
  for (const [key, value] of Object.entries(incomingobject)) {
    const match = expectedkeys.find((element) => element.key === key);

    // Check if the key exists in the expected keys
    if (!match) {
      throw new Error(`Your incoming object has an unexpected key: ${key}.`);
    }

    // Validate the type of the value
    if (match.type !== "array" && match.type !== typeof value) {
      throw new Error(
        `Expected a ${
          match.type
        } for key ${key} in the first parameter, but received a ${typeof value}.`
      );
    }

    // Special handling for array type
    if (match.type === "array" && !Array.isArray(value)) {
      throw new Error(
        `Expected an array for key ${key} in the incoming object, but received a ${typeof value}.`
      );
    }
    if (value === null) {
      throw new Error(
        `expected ${match.type} in key ${key} of the first parameter but you gave a null value`
      );
    }
    // Handle cases where 'type' is an array of acceptable types
    if (Array.isArray(match.type) && !match.type.includes(typeof value)) {
      throw new Error(
        `Expected one of [${match.type.join(
          ", "
        )}] for key ${key}, but received ${typeof value}.`
      );
    }

    // If all checks pass, add the key to the good keys array
    goodkeys.push(key);
  }

  // Check for any missing keys
  const missingkeys = expectedkeys
    .map((detail) => detail.key)
    .filter((key) => !goodkeys.includes(key));
  if (missingkeys.length > 0) {
    throw new Error(`You are missing keys [${missingkeys.join(", ")}].`);
  }

  return goodkeys;
};
exports.teacherselect = async (arg) => {
  try {
    // Ensure no type mismatch
    this.typechecker(arg, [
      { key: "teacherids", type: "array" }, // Array of the teachers we're selecting from
      { key: "Subjects", type: "object" }, // Subjects model dependency
      { key: "transaction", type: "object" }, // Transaction dependency
    ]);

    const { teacherids, Subjects, transaction } = arg;
    let teachers_to_subjects = [];
    let no_of_subjects = [];

    for (const teacherid of teacherids) {
      const subjects_taken = await Subjects.findAll({
        where: { id: teacherid },
        transaction,
      });

      if (subjects_taken.length === 0) {
        return teacherid;
      } else {
        teachers_to_subjects.push({
          teacherid,
          no_of_subject: subjects_taken.length,
        });
        no_of_subjects.push(subjects_taken.length);
      }
    }

    const min_subject_count = Math.min(...no_of_subjects);
    const choosenteacher = teachers_to_subjects.find(
      (detail) => detail.no_of_subject === min_subject_count
    );

    return choosenteacher ? choosenteacher.teacherid : null;
  } catch (error) {
    console.error("error:", error);
    throw error; // Optionally rethrow the error to let the caller handle it
  }
};

function createUploadMiddleware(externalUploadDir) {
  // Ensure the directory exists
  if (!fs.existsSync(externalUploadDir)) {
    fs.mkdirSync(externalUploadDir, { recursive: true });
  }

  // Set up multer
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, externalUploadDir); // Use the external directory
    },
    filename: function (req, file, cb) {
      const staffId = req.body.staff_id || "default";
      cb(null, `${staffId}${path.extname(file.originalname)}`);
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
    fileFilter: function (req, file, cb) {
      // Allowed file types
      const filetypes = /jpeg|jpg|png|gif/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Images Only!");
      }
    },
  }).single("image"); // 'image' is the field name in the form
}

module.exports = createMulterInstance;
