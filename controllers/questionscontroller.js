const Question = require('../models/questions');
exports.createQuestion = async (req, res) => {
  try {
    const { question, option_a,option_b,option_c,option_d,correctAnswer} = req.body;
    const questions = await Question.create({ question, option_a,option_b,option_c,option_d,correctAnswer });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, option_a,option_b,option_c,option_d,correctAnswer } = req.body;
    await Question.update({ question, option_a,option_b,option_c,option_d,correctAnswer }, { where: { id } });
    res.json({ message: "question number "+id+' updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.destroy({ where: { id } });
    res.json({ message: "question number "+id+' deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
