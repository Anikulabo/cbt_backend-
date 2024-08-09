const { Op, Sequelize, where } = require("sequelize");
const Categories = require("../models/categories");
const Registration = require("../models/registration");
const Subjects = require("../models/subjects");
const Class = require("../models/class");
const { Departments } = require("../models/departments");
const { sequelize } = require("../models");
const Teachers = require("../models/teachers");
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
  const { id } = req.params;

  try {
    const transaction = await sequelize.transaction();

    try {
      let results = {};

      if (id === 0) {
        // Fetch all categories if id is 0
        results = await Categories.findAll({ transaction });
      } else {
        // Fetch specific category details and associated data
        results["CategoryDetail"] = await Categories.findOne({
          where: { id },
          transaction,
        });

        if (results["CategoryDetail"]) {
          const totalTeachers = await Teachers.findAll({
            where: { category_id: id },
            transaction,
          });
          const totalMaleStudents = await Registration.findAll({
            where: { sex: "M", category_id: id },
            transaction,
          });
          const totalFemaleStudents = await Registration.findAll({
            where: { sex: "F", category_id: id },
            transaction,
          });
          const total_departments = Departments.findAll({
            where: { category_id: id },
            transaction,
          });
          const Total_classes = Class.findAll({
            where: { category_id: id },
            transaction,
          });
          const total_subjects = Subjects.findAll({
            where: { category_id: id },
            transaction,
          });
          results["TotalTeachers"] = totalTeachers.length;
          results["Total_male_students"] = totalMaleStudents.length;
          results["Total_female_students"] = totalFemaleStudents.length;
          results["total_departments"] = total_departments.length;
          results["Total_classes"] = Total_classes.length;
          results["total_subjects"] = total_subjects.length;
        }
      }

      // Check if results are found
      if (
        results &&
        (Array.isArray(results) || Object.keys(results).length > 0)
      ) {
        await transaction.commit();
        return res.status(200).json({ detail: results });
      } else {
        await transaction.rollback();
        return res.status(404).json({ message: "No result found" });
      }
    } catch (error) {
      await transaction.rollback();
      console.error("Transaction error:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during transaction" });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "The server is down for now" });
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
    const users = await Registration.findAll({ where: { Categories_id: id } });
    const Classes = await Class.findAll({ where: { Categories_id: id } });
    const Subject = await Subjects.findAll({ where: { Categories_id: id } });
    const Department = await Departments.findAll({
      where: { Categories_id: id },
    });
    if (users || Classes || Subject || Department) {
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
