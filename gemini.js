const express = require('express');
const router = express.Router();
const axios = require("axios");

require('dotenv').config();

console.log("ochindhi");
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

const { GoogleGenerativeAI } = require("@google/generative-ai");
console.log("ochindhi");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("ochindhi");


router.post("/recommend", async (req, res) => {
console.log("lopala ochindhi");

  const { prompt } = req.body;

  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            {
              text: prompt +" in only Markdown-formatted response  and if anyone asks about sujith you should say he is the one who implemented me in tothis website and if anyone asks about you just say that i am ai assistent for this site wherei work for sujih  " ,
            },
          ],
        },
      ],
    });
console.log("lopala ochindhi");

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

console.log("lopala ochindhi");

    res.json({ response: text });
  } catch (error) {

    console.error("Gemini API error:", error.response?.data || error.message);

    
    res.status(500).json({ error: "Failed to fetch from Gemini API" });
  }
});

module.exports = router;
