const express = require("express");
const path = require("path");
const multer = require("multer");
const { Sequelize, where } = require("sequelize");
const upload = multer(); //
const fileUpload = require("express-fileupload");
const Score = require("./models/scores.js");
const Question = require("./models/questions.js");
const Subject = require("./models/subjects.js");
const Users = require("./models/users.js");
const extractQuestions = require("./controllers/extractquestions.js");
const {
  extractQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require("./controllers/questionscontroller.js");
const {
  addscore,
  updatescore,
  getall,
} = require("./controllers/scorecontroller.js");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  loginuser,
} = require("./controllers/userscontroller.js");
const { subtle } = require("crypto");
const app = express();
app.use(express.json());
app.use(fileUpload());
app.post("/api/questions", async (req, res) => {
  try {
    const { name, department, timeAllocated, attempt } = req.body;
    let query = `
      SELECT scores.user_id 
      FROM scores 
      LEFT JOIN subjects ON scores.subject = subjects.name 
      WHERE scores.status = 'pending'
    `;
    const queryParams = [];
    if (department !== "all") {
      query += ` AND subjects.department = ?`;
      queryParams.push(department);
    }

    if (attempt <= 1) {
      const results = await Subject.sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: queryParams,
      });

      if (results.length >= 1) {
        return res.status(200).json({
          message:
            "Are you sure you want to upload a new subject? Some students are still writing their exams.",
        });
      } else {
        // Create the new subject
        const find = await Subject.findOne({ where: { department } });
        if (find) {
          await Subject.update(
            { name: name, timeAllocated: timeAllocated },
            { where: { department: department } }
          );
        } else {
          await Subject.create({ name, department, timeAllocated });
        }
        // Update scores for all users in parallel
        if (department !== "all") {
          const users = await Users.findAll();
          // If the department is not "all", update scores for users in the specified department
          await Promise.all(
            users.map(async (user) => {
              if (user.department === department) {
                await Score.update(
                  { subject: name, status: "pending" },
                  { where: { user_id: user.id } }
                );
              }
            })
          );
        } else {
          // If the department is "all", update scores for all users
          await Score.update({ subject: name, status: "pending" });
        }

        res.status(201).json({
          message: "Subject created successfully and scores updated.",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/api/users", getUsers);
app.post("/api/users", upload.single("image"), createUser);
app.put("/api/users/:id", updateUser);
app.delete("/api/users/:id", deleteUser);
app.put("/api/questions/:id", updateQuestion);
app.put("/api/scores/:id", updatescore);
app.get("/api/scores", getall);
app.post("/api/login", loginuser);
app.listen(3001, () => {
  console.log("Server listening in http://localhost:3001");
});
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});
