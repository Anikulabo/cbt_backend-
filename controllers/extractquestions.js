// extractQuestions.js
const mammoth = require('mammoth');

async function extractQuestions(filePath) {
  const { value: {body: {content}} } = await mammoth.extractRawText({path: filePath});

  const questions = [];
  let currentQuestion = null;
  let currentOptions = null;

  // Split content by new lines
  const lines = content.split('\n');

  lines.forEach(line => {
    // Check if line contains a question (You need to adjust this logic based on your specific document format)
    if (line.startsWith('Q:')) {
      // If a question is found, save the previous question (if any)
      if (currentQuestion) {
        questions.push({
          question: currentQuestion,
          options: currentOptions
        });
      }
      // Reset current question and options
      currentQuestion = line.substring(3).trim(); // Remove "Q:" from the beginning
      currentOptions = [];
    } else if (line.match(/^[A-D]\./)) {
      // Check if line contains an option (A., B., C., D.)
      currentOptions.push(line.substring(3).trim()); // Remove the option label and trim spaces
    } else if (line.startsWith('Correct Answer:')) {
      // Check if line contains correct answer
      const correctAnswer = line.substring(15).trim(); // Remove "Correct Answer:" from the beginning
      // Add correct answer to the options
      currentOptions.push(correctAnswer);
    }
  });

  // After looping through all lines, add the last question
  if (currentQuestion) {
    questions.push({
      question: currentQuestion,
      options: currentOptions
    });
  }

  return questions;
}

module.exports = extractQuestions;
