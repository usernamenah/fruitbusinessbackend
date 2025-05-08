const express = require('express');
const router = express.Router();
const FeedbackModel = require('./models/feedbackmodel');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
router.use(express.json()); 


router.post("/postfeedback", async (req, res) => {
    try {
        const { feedback } = req.body;
        console.log(feedback);
        const email = req.cookies.emailnamefororder;

        if (!email || !feedback) {
            return res.status(400).json({ message: "Missing email or feedback" });
        }

        const newFeedback = new FeedbackModel({ email, feedback });
        await newFeedback.save();

        res.status(201).json({ message: "Feedback saved successfully" });
    } catch (err) {
        console.error("Error saving feedback:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
