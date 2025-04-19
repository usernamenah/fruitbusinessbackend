const express = require('express');
const bcrypt = require('bcrypt');
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
        
        if (!token) {
            return res.status(400).json({ error: "Token not provided" });
        }


        
        const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });

        
        const { sub, name, email, picture } = ticket.getPayload();
        let checkphno = true;
        console.log("TOKEN RECEIVED:", token);
        console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);




        let user = await User.findOne({ googleId: sub });
        if (!user) {
            user = new User({ googleId: sub, name, email, picture, phno: 0 });
            await user.save();
        }
        if (user.phno === 0) {
            checkphno = false;
        }
        console.log(user.email);
        console.log("TOKEN RECEIVED:", req.body.token);
        console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);



        console.log("Ticket Payload:", ticket.getPayload());



        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Set cookie securely
        res.cookie("authToken", authToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Secure in production only
            // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: true,
            sameSite: 'None',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });
        console.log(checkphno);
        res.cookie("chpn", checkphno, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Secure in production only
            // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: true,
            sameSite: 'None',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });
        res.cookie("emailnamefororder", user.email, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production', // Secure in production only
            // sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: true,
            sameSite: 'None',
            maxAge: 12 * 60 * 60 * 1000 // 12 hours
        });

        return res.json({ message: "Login successful", redirect: "/home" });
    } catch (err) {
        console.error("❌ Google Authentication Error:", err);
        return res.status(500).json({ error: "Google authentication failed" });
    }
});


module.exports = router;