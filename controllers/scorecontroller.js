const fs = require("fs");
const { Sequelize } = require("sequelize");
const Score = require("../models/scores");
exports.getall = async (req, res) => {
  const data = await Score.findall();
  res.json(data);
};
exports.updatescore = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, status } = req.body;
    await Score.update({ score, status }, { where: { id } });
    res.json({ message: "Data updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
