const express = require('express');
const bcrypt=require('bcrypt');
const router = express.Router();
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');  
const jwt = require("jsonwebtoken");


const User = require('./models/getinfomodel');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// Google Login Route


router.post("/google-login", async (req, res) => {
    try {

        const { token } = req.body;
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
        const { sub, name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = new User({ googleId: sub, name, email, picture });
            await user.save();
        }

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set cookie securely
        res.cookie("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production only
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });

        return res.json({ message: "Login successful", redirect: "/home" }); // ✅ RETURN to prevent multiple responses
    } catch (err) {
        console.error("❌ Google Authentication Error:", err);
        return res.status(500).json({ error: "Google authentication failed" });
    }
});


module.exports = router;