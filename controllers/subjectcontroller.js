const { where } = require("sequelize");
const teacherselect = require("./jwtgeneration");
exports.addsubject = async (req, res, { models }) => {
  const {
    name, // expect a string
    categories, // expect an array of numbers
    departments, // expect an object of form {cate_name: an integer}
    teachers, // expect an object of the form {cate_name: an array of integer}
    compulsory, // expect an object of the form {cate_name: boolean}
  } = req.body;
  const { Subjects, sequelize, Categories } = models;

  try {
    const transaction = await sequelize.transaction();
    try {
      for (const category of categories) {
        const cate_detail = await Categories.findOne({
          where: { id: category },
          transaction,
        });
        if (!cate_detail) {
          await transaction.rollback();
          return res
            .status(404)
            .json({ message: "No category matches your description" });
        }
        
        const dept = departments[cate_detail.categoryName];
        const cateName = cate_detail.categoryName;

        for (let year = 1; year <= cate_detail.year; year++) {
          const selectedteacher = await teacherselect({
            teacherids: teachers[cateName],
            Subjects,
            transaction,
          });

          await Subjects.create({
            year,
            category_id: category,
            department_id: dept,
            teacherid: selectedteacher,
            compulsory: compulsory[cateName],
            name: name,
          }, { transaction });
        }
      }
      await transaction.commit();
      return res.status(200).json({ message: "Subjects added successfully" });
    } catch (error) {
      await transaction.rollback();
      console.error("error:", error);
      return res.status(500).json({ message: "Transaction could not complete" });
    }
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "Unable to start transaction" });
  }
};

