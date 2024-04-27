const fs = require("fs");
const { Sequelize } = require("sequelize");
const Score = require("../models/scores");
 const { response } = require("express");
exports.addscore = async (req, res) => {
  try {
    const { userid, subject, score, status } = req.body;
    let data = { userid, subject, score, status };
    data = await Score.create(data);
    res.status(201).json({ message: "your data has been successfully added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getall=async(req,res)=>{
    const data=await Score.findall();
    res.json(data)    
}
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
