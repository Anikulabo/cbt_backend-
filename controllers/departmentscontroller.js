const { Op, Sequelize, where } = require("sequelize");
const { Departments } = require("../models/departments");
const { Categories } = require("../models/categories");
const { Users } = require("../models/users");
const { Subjects } = require("../models/subjects");
const Class = require("../models/class");
exports.adddepartment = async (req, res) => {
  const { category_id, name } = req.body;
  try {
    await Departments.create({ category_id, name });
    return res.status(201).json({ message: "department successfully added" });
  } catch (error) {
    console("error:", error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
exports.viewdepartments = async (req, res) => {
  const { category_id } = req.params; // Fixed typo: req.param to req.params
  try {
    if (category_id) {
      const depts = await Departments.findAll({
        where: { category_id: category_id },
      });

      if (depts.length > 0) { // Checking if there are any departments found
        return res.status(200).json({ departments: depts }); // Use 200 status code for success
      } else {
        return res.status(404).json({ message: "There is no department under this category" }); // 404 for not found
      }
    } else {
      const cate_depts = {};
      const categories = await Categories.findAll();

      // Using Promise.all to handle all category-related queries concurrently
      await Promise.all(categories.map(async (category) => {
        const departments = await Departments.findAll({
          where: { category_id: category.id },
        });

        cate_depts[category.categoryName] = departments.length > 0 
          ? departments 
          : "There are no departments under this category";
      }));

      return res.status(200).json({ departments: cate_depts }); // Use 200 status code for success
    }
  } catch (error) {
    console.error("Error:", error); // Logging the error for debugging
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updatedepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Departments.update({ name }, { where: { id } });
    res.status(201).json({ message: "department successfully updated" });
  } catch (error) {
    console("error:", error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
exports.deletedepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await Users.findAll({ where: { department_id: id } });
    const Classes = await Class.findAll({ where: { department_id: id } });
    const Subject = await Subjects.findAll({ where: { department_id: id } });
    if (users || Classes || Subject) {
      return res.status(201).json({
        message:
          "this department is still being used it is best you update rather than delete it",
      });
    } else {
      await Departments.destroy(id);
      res.status(201).json({ message: "department deleted successfully" });
    }
  } catch (error) {
    console("error:", error);
    return res.status(500).json({ message: "the server is down for now" });
  }
};
