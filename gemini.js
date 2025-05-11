const express = require('express');
const router = express.Router();
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/recommend", async (req, res) => {
  const { problem, juiceList } = req.body;

  if (!problem || !Array.isArray(juiceList)) {
    return res.status(400).json({ error: "Please provide a 'problem' and a valid 'juiceList'" });
  }

  const juiceDescriptions = juiceList.join("\n");

  const prompt = `
You're a health juice recommender. Based on the user's problem: "${problem}",
choose the 2-3 most suitable juices from this list:

${juiceDescriptions}

Respond with only the juice names, separated by commas.
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const recommendations = text.split(",").map(item => item.trim());

     // Check length safely
  if (!recommendations || recommendations.length === 0) {
    return res.status(200).json({ recommendations: [], message: "No recommendations found." ,length:2 });
  }


    console.log("recommendations");
    console.log(recommendations);

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to get recommendation." });
  }
});

module.exports = router;
