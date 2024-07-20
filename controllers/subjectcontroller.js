const teacherselect = require("./jwtgeneration");
exports.addsubject = async (req, res, { models, notifyauser }) => {
  const {
    name, // expect a string
    categories, // expect an array of numbers
    departments, // expect an object of form {cate_name: an integer}
    teachers: teachersInput, // expect an object of the form {cate_name: an array of integer}
    compulsory, // expect an object of the form {cate_name: boolean}
  } = req.body;
  const { Subjects, sequelize, Categories, notifications, Activity } = models;

  try {
    const transaction = await sequelize.transaction();
    try {
      const teachersMap = {};
      const unmannedsubject = [];
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
          const selectedteacher = teachersInput[cateName]
            ? await teacherselect({
                teacherids: teachersInput[cateName],
                Subjects,
                transaction,
              })
            : 0;
          let detail = await Subjects.create(
            {
              year,
              category_id: category,
              department_id: dept,
              teacherid: selectedteacher,
              compulsory: compulsory[cateName],
              name: name,
            },
            { transaction }
          );
          if (selectedteacher === 0) {
            unmannedsubject.push(detail.id);
          } else {
            if (teachersMap[selectedteacher]) {
              teachersMap[selectedteacher].push(detail.id);
            } else {
              teachersMap[selectedteacher] = [detail.id];
            }
          }
        }

        for (const [key, value] of Object.entries(teachersMap)) {
          await notifyauser({
            description: `You've been assigned to teach ${value.length} subjects. Check portal for more details.`,
            performed_by: 0,
            roleOfperformer: 0,
            transaction: transaction,
            recipient: parseInt(key),
            roleOfrecipient: 2,
          });
        }
      }
      await transaction.commit();
      return res.status(200).json({
        message:
          unmannedsubject.length === 0
            ? "Subjects added successfully"
            : `Subjects added successfully. ${unmannedsubject.length} subjects still need teachers. View subjects for more details.`,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Inner transaction error:", error);
      return res.status(500).json({ message: "Transaction could not complete" });
    }
  } catch (error) {
    console.error("Outer transaction error:", error);
    return res.status(500).json({ message: "Unable to start transaction" });
  }
};
exports.viewsuject=async(req,res)=>{

}
