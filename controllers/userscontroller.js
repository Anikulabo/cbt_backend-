const fs = require("fs");
const { Sequelize, where } = require("sequelize");
const User = require("../models/users.js");
const path = require("path");
const { promisify } = require("util");
const QRCode = require("qrcode");
const subject = require("../models/subjects.js");
const Question = require("../models/questions.js");
const Score = require("../models/scores.js");
const Subject = require("../models/subjects.js");
const writeFileAsync = promisify(fs.writeFile);
exports.createUser = async (req, res) => {
  try {
    const { username, password, department } = req.body;
    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    let user = { username, password, department };
    // Check if an image was uploaded
    if (req.file) {
      const imageData = req.file.buffer; // Access file data from req.file.buffer
      const imageName = `${username}.jpg`; // Generate a unique name for the image
      const imagePath = path.join(
        __dirname,
        "../client/src/components/img",
        imageName
      ); // Path to save the image
      // Write the image data to the file
      await writeFileAsync(imagePath, imageData, "base64");

      // Attach the image path to the user object
      user.image = username;
    }

    // Save the user object to the database
    user = await User.create(user);
    let data = await User.findOne({ where: { username } });
    Score.create({ user_id: data.id });
    res.status(201).json({ message: "User is ready to take an exam" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUsers = async (req, res) => {
  try {
    // Construct the SQL query
    let query =
      "SELECT scores.id,users.username, users.department, users.image, scores.subject, scores.status FROM users LEFT JOIN scores ON users.id = scores.user_id where users.department!='admin'";
    // Execute the query
    const results = await User.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT, // specify the query type
    });

    // Send the fetched user data back to the client as JSON
    res.json(results);
  } catch (error) {
    // Handle any errors
    console.error("Error executing query:", error);
    // Send an error response back to the client
    res
      .status(500)
      .json({ error: "An error occurred while fetching user data." });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, status } = req.body;
    await User.update({ username, password, status }, { where: { id } });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({ where: { id } });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Assume you have imported the necessary modules and models

exports.notificationForDownload = async (req, res) => {
  try {
    const { dept } = req.params; // Access query parameters instead of body

    // Find the subject for the specified department
    const subject = await Subject.findOne({ where: { department: dept } });

    // Find all students in the department
    if (subject) {
      const studentsInDept = await User.findAll({
        where: { department: dept },
      });

      // Find all test takers who have completed the test for the subject
      const testTakers = await Score.findAll({
        where: { status: "done", subject: subject.name },
      });

      // Check if the number of test takers matches the number of students in the department
      if (testTakers.length === studentsInDept.length) {
        let query = `SELECT users.username, users.image, scores.score FROM users LEFT JOIN scores ON users.id = scores.user_id where users.department='${dept}'`;
        const results = await User.sequelize.query(query, {
          type: Sequelize.QueryTypes.SELECT, // specify the query type
        });
        const qrText = `This is the original ${subject.name} result`;
        const qrImageData = await QRCode.toDataURL(qrText);
        return res.status(201).json({
          message: `The results for ${subject.name} in ${dept} are now ready for download`,
          results: results,
          subject: subject.name,
          qrCodeImage: qrImageData, // Include QR code image data in the response
        });
      } else {
        return res.status(200).json({
          message: `Waiting for all students in ${dept} to complete the test for ${subject.name}`,
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginuser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user && password === user.password) {
      if (user.department !== "admin") {
        const test = await subject.findOne({
          where: { department: user.department },
        });
        
        if (test) {
          const alreadydone = await Score.findAll({
            where: { subject: test.name, status: "done" },
          });
          const confirm = alreadydone.find((item) => item.user_id === user.id);
          if(!confirm){
            const  questions = await Question.findAll({
              where: { subject: test.name },
            });
            const score = await Score.findOne({ where: { user_id: user.id } });
            res.status(200).json({
              userdata: user,
              questions: questions,
              subject: test.name,
              time: test.timeAllocated,
              scoreid: score.id,
            });
          }else{
            res.status(201).json({
              message:
                "report shows that you've done the test before go to the admin of the site for more information",
              userdata: user,
            })
          }
        }
        else {
          res.status(202).json({
            message: "you department is not currently having an exam",
            userdata: user,
          });
        }
      } else {
        res.json({ userdata: user });
      }
    } else {
      res.status(401).send("Invalid username or password");
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Error logging in,server is down for now");
  }
};
