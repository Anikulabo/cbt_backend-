const Subject = require("../models/subjects");
const { Sequelize } = require("sequelize");
exports.postsubject = async (req, res) => {
  let results = "";
  try {
    const { subject, dept, time, after } = req.body;
    if (after <= 1) {
      if (dept !== "all") {
        let query = `SELECT scores.user_id 
                                 FROM scores 
                                 LEFT JOIN subjects ON scores.subject = subjects.name 
                                 WHERE subjects.department = '${dept}' 
                                 AND scores.status = 'pending'`;
        results = await Subject.sequelize.query(query, {
          type: Sequelize.QueryTypes.SELECT, // specify the query type
        });
      } else {
        let query = `SELECT scores.user_id 
              FROM scores 
              LEFT JOIN subjects ON scores.subject = subjects.name 
              WHERE scores.status = 'pending'`;
        results = await Subject.sequelize.query(query, {
          type: Sequelize.QueryTypes.SELECT, // specify the query type
        });
      }
      const totalresults = results.length;
      if (totalresults >= 1) {
        res
          .status(200)
          .json({
            message:
              totalresults +
              " are still doing their exams are you sure you want to upload this subject",
          });
      } else {
        let input = { subject, dept, time };
        Subject.create(input);
       res.status(200).json({message:"subject has been successfully added"})
      }
    } else {
      let input = { subject, dept, time };
      Subject.create(input);
      res.status(200).json({message:"subject has been successfully added"})
    }
  } catch (error) {
    // Handle any errors that occur during query execution or data retrieval
    console.error("Error:", error);
  }
};
