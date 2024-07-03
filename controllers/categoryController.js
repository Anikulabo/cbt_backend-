const { Op, Sequelize, where } = require("sequelize");
const { Categories } = require("../models/categories");
const { Users } = require("../models/users");
const { Subjects } = require("../models/subjects");
const Class = require("../models/class");
const {Departments}=require("../models/departments")
exports.addcategory = async (req, res) => {
  const { categoryName, years } = req.body;
  try {
    await Categories.create({ categoryName, years });
    return res.status(201).json({ message: "category successfully added" });
  } catch (error) {
    console("error:", error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
exports.viewcategory = async (req, res) => {
  try {
    const categories = await Categories.findAll();
    res.status(201).json({ categories: categories });
  } catch (error) {
    console("error:", error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
exports.updatecategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, years } = req.body;
  try {
    await Categories.update({ categoryName, years }, { where: { id } });
    res.status(201).json({ message: "category successfully updated" });
  } catch (error) {
    console("error:", error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
exports.deletecategory = async (req, res) => {
    const { id } = req.params;
    try {
      const users = await Users.findAll({ where: { Categories_id: id } });
      const Classes = await Class.findAll({ where: { Categories_id: id } });
      const Subject = await Subjects.findAll({ where: { Categories_id: id } });
      const Department=await Departments.findAll({ where: { Categories_id: id } })
      if (users || Classes || Subject||Department) {
        return res.status(201).json({
          message:
            "this category is still bein gused it is best you update rather than delete it",
        });
      } else {
        await Categories.destroy(id);
        res.status(201).json({ message: "category deleted successfully" });
      }
    } catch (error) {
      console("error:", error);
      return res.status(500).json({ message: "the server is down for now" });
    }
  };
