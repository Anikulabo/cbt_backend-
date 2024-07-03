const Class = require("../models/class");
const Category = require("../models/categories");
const Teachers = require("../models/teachers");
const notifyauser = require("./sessioncontrollers");
const { Sequelize } = require("sequelize");
const { sequelize } = require("../models");
exports.addclass = async (req, res) => {
  const { year, category_id, department_id, name, teacherid } = req.body;
  const performer = req.user;
  try {
    const transaction = await sequelize.transaction();
    try {
      //get category detail
      const cate_detail = await Category.findOne({
        where: { id: category_id },
        transaction,
      });
      // to see if the teacher has been previously assigned
      const findteacher = await Class.findOne({
        where: { teacherid },
        transaction,
      });
      // to make sure all class have unique name
      const findclass = await Class.findOne({ where: { name }, transaction });
      if (!cate_detail) {
        return res.status(404).json({
          message: "there is no category that matches your description ",
        });
      }
      if (findteacher) {
        await transaction.rollback();
        return res.status(500).json({
          message: `the teacher you selected is already a class teacher of ${findteacher.name}`,
        });
      }
      if (findclass) {
        await transaction.rollback();
        return res.status(500).json({
          message: `the name of the class is already being used`,
        });
      }
      if (year < cate_detail.year && !findteacher && !findclass) {
        await Class.create(
          {
            year,
            category_id,
            department_id,
            name,
            teacherid,
          },
          transaction
        );
        // log activity and notify the teacher assigned
        const obj = {
          description: `you've been assigned as the class teacher of class ${name} of category ${cate_detail.category.Name} year ${year}`,
          performed_by: performer.userid,
          roleOfprformer: performer.role,
          transaction: transaction,
          recipient: teacherid,
          roleOfrecipient: 3,
        };
        await notifyauser(obj);
        await transaction.commit();
        return res.status(200).json({
          message: "the new class has been successfully created",
        });
      } else {
        await transaction.rollback();
        return res.status(500).json({
          message: `no class can have a year above its category year`,
        });
      }
    } catch (error) {
      transaction.rollback();
      console.error("error:", error);
      return res.status(500).json({ error: "internal server error" });
    }
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "" });
  }
};
exports.editclass = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await Class.update({ class: name }, { id });
    return res.status(201).json({ message: "class successfully updated" });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "internal server error" });
  }
};
exports.deleteclass = async (req, res) => {
  const { id } = req.params;
  try {
    await Class.destroy({ where: { id } });
    return res.status(201).json({ message: "session successfully deleted" });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "internal server error" });
  }
};
exports.viewclasses = async (req, res) => {
  const { className } = req.params;
  // Construct a parameterized query
  const query = "SELECT * FROM class WHERE class LIKE :className";
  try {
    // Execute the query with parameters
    const results = await Class.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements: { className: `%${className}%` }, // Pass the className as a parameter
    });
    return res.status(200).json({ classes: results });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
