const fs = require("fs");
const { Sequelize } = require("sequelize");
const Score = require("../models/scores");
const User=require("../models/users")
exports.getresults = async (req, res) => {
  try {
    const { dept } = req.params;
    const query = `
      SELECT users.image, users.username, scores.score
      FROM users
      LEFT JOIN scores ON users.id = scores.user_id
      WHERE users.department = :dept
    `;

    // Use Sequelize's query method with placeholders (:dept)
    const results = await User.sequelize.query(query, {
      replacements: { dept }, // Bind department value to the placeholder
      type: Sequelize.QueryTypes.SELECT,
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
   console.log("error:",error.message)
  }
};

exports.updatescore = async (req, res) => {
  try {
    const { id, course } = req.params;
    const { score, status, subject } = req.body;
    if (id) {
      // Update based on id
      await Score.update({ score, status, subject }, { where: { id } });
      res.json({ message: "Data updated successfully based on id" });
    } else if (course) {
      // Update based on course
      await Score.update({ score, status }, { where: { subject: course } });
      res.json({ message: "Data updated successfully based on course" });
    } else {
      res.status(400).json({ message: "Neither id nor course provided" });
    }    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

