const express = require('express');
const router = express.Router();
const FeedbackModel = require('./models/feedbackmodel');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(express.json());

router.post("/postfeedback", async (req, res) => {
    try {
        const { feedback } = req.body;
        const email = req.cookies.emailnamefororder;

        if (!email || !feedback) {
            return res.status(400).json({ message: "Missing email or feedback" });
        }

        // Upsert: find the document by email and push new feedback to the array
        await FeedbackModel.findOneAndUpdate(
            { email },
            { $push: { feedback: { message: feedback, date: Date.now() } } },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: "Feedback saved successfully" });
    } catch (err) {
        console.error("Error saving feedback:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
