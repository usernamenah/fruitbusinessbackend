const express = require('express');
// const OpenAI = require('openai');
require('dotenv').config();

const router = express.Router();

// ✅ Create OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

router.post("/recommend", async (req, res) => {

    res.status(200).json( "recommendations are stopped bcz our AImodel doesnt run or free so it requires money that is why we stopped " );
//   const { problem, juiceList } = req.body;

//   if (!problem || !Array.isArray(juiceList)) {
//     return res.status(400).json({ error: "Please provide a 'problem' and a valid 'juiceList'" });
//   }

//   const juiceDescriptions = juiceList.join("\n");

//   const prompt = `
// You're a health juice recommender. Based on the user's problem: "${problem}",
// choose the 2-3 most suitable juices from this list:

// ${juiceDescriptions}

// Respond with only the juice names, separated by commas.
//   `;

//   try {
   
//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const reply = completion.choices[0].message.content;
//     const recommendations = reply.split(",").map(j => j.trim());

//     res.status(200).json({ recommendations });
//   } catch (error) {
//     console.error("OpenAI Error:", error);
//     res.status(500).json({ error: "Failed to get recommendation." });
//   }
});

module.exports = router;
