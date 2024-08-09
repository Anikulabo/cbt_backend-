const Class = require("../models/class");
const Category = require("../models/categories");
const Score = require("../models/scores");
const { objectreducer } = require("./jwtgeneration");
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
  const { year, category_id, department_id, name, teacherid } = req.body;
  try {
    const transaction = await sequelize.transaction();
    try {
      const intialdetail = await Class.findOne({ where: { id } }, transaction);
      let reducedobject = objectreducer(intialdetail, {
        year,
        category_id,
        department_id,
        name,
        teacherid,
      });
      await Class.update(
        reducedobject.newobject,
        { where: { id } },
        transaction
      );
      await transaction.commit();
      return res.status(201).json({
        message: `fields ${reducedobject.changeditems.join(
          ", "
        )} of class  has been successfully updated`,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("error:", error);
      res.status(500).json({ message: "error during transaction" });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({
      message: "unable to start transaction probably an internal server error",
    });
  }
};
exports.deleteclass = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await sequelize.transaction();
    try {
      let pastrecord = await Score.findOne(
        { where: { class_id: id } },
        transaction
      );
      if (pastrecord) {
        await transaction.rollback();
        return res.status(400).json({
          message:
            "class already have some records so it can't be deleted you can only update it",
        });
      } else {
        await Class.destroy({ where: { id } }, transaction);
        await transaction.commit();
        return res.status(201).json({ message: "class successfully deleted" });
      }
    } catch (error) {
      await transaction.rollback();
      console.error("error:", error);
      res.status(500).json({ message: "error during transaction " });
    }
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ message: "internal server error" });
  }
};
exports.viewclasses = async (req, res) => {
  const { id } = req.params;
  let query, results;

  try {
    if (id != 0) {
      // Construct a parameterized query
      query = `
        SELECT 
          classes.id, classes.name, classes.year, 
          departments.name as department, category.categoryName, 
          teachers.fname as managedBy 
        FROM 
          classes 
        LEFT JOIN 
          departments ON classes.department_id = departments.id 
        LEFT JOIN 
          category ON classes.category_id = category.id 
        LEFT JOIN 
          teachers ON classes.teacherid = teachers.id 
        WHERE 
          classes.id = :id 
        LIMIT 1
      `;

      // Execute the query with parameters
      results = await Class.sequelize.query(query, {
        type: Sequelize.QueryTypes.SELECT,
        replacements: { id: id },
      });

      // Check if class details are found
      if (results.length > 0) {
        const student_in_class = await Class.findAll({ where: { class_id: id } });
        results[0]['total_students'] = student_in_class.length;

        return res.status(200).json({ details: results });
      } else {
        return res.status(404).json({ message: "No class found under such criteria" });
      }
    } else {
      // Fetch all classes when id is 0
      results = await Class.findAll({ attributes: ["id", "name"] });

      return res.status(200).json({ details: results });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
