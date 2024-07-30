const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI('AIzaSyD9BrEOXDCJoBgUJtRJ3zM3r8ZM_ZkZaU0');

async function run(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  //const prompt = {prompt}

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text
}

module.exports = run;