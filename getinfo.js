const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const User = require('./models/getinfomodel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub, name, email, picture } = ticket.getPayload();

    // Find or create user
    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = new User({ googleId: sub, name, email, picture });
      await user.save();
    }

    // Create JWT
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set secure cookie
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : "localhost",
      maxAge: 3600000
    });

    res.status(200).json({
      success: true,
      user: { name, email, picture },
      redirect: "/home"
    });

  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({
      success: false,
      error: "Authentication failed",
      details: err.message
    });
  }
});

module.exports = router;