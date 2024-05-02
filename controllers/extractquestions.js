// extractQuestions.js
const mammoth = require("mammoth");
async function extractQuestions(filePath, subject) {
  const result = await mammoth.extractRawText({ path: filePath });
  return result;
}

module.exports = extractQuestions;
