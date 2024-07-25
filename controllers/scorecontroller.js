exports.addscore = async (req, res, { models }) => {
  const {
    studentdetails, // an array of object with keys [userid,score] studentid is an integer while score is also an object key {CA}or {CA and exam}
    subjectid, //is an integer
  } = req.body;
  const { Registration, Score, Sessions, sequelize } = models;
  try {
    const transaction = await sequelize.transaction();
    try {
      const activeSessionDetail = await Sessions.findOne({
        where: { active: true },
        attributes: ["id"],
        transaction,
      });
      for (const { userid, score } of studentids) {
        const user_detail = await Registration.findOne({
          where: { id: userid },
          transaction,
        });
        if (user_detail) {
          const checkalreadyexist = await Score.findOne({
            where: {
              user_id: userid,
              subject_id: subjectid,
              session_id: activeSessionDetail["id"],
            },
            transaction,
          });
          if (checkalreadyexist) {
                
        } else {
            switch (type) {
              case "CA":
                await Score.create(
                  {
                    user_id: userid,
                    session_id: activeSessionDetail["id"],
                    subject_id: subjectid,
                    class_id: user_detail["class_id"],
                    CA: score,
                    CA_status: true,
                  },
                  transaction
                );
              default:
                await Score.create(
                  {
                    user_id: userid,
                    session_id: activeSessionDetail["id"],
                    subject_id: subjectid,
                    class_id: user_detail["class_id"],
                    exam: score,
                    exam_status: true,
                  },
                  transaction
                );
            }
          }
        }
      }
    } catch (error) {
      console.error("error:", error);
      return res
        .status(500)
        .json({ message: "unable to complete transaction" });
    }
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};
