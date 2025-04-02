const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require("jsonwebtoken");
const User = require('./models/getinfomodel');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google-login", async (req, res) => {
  try {
    const { token } = req.body;
    
    // First validate the token structure
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return res.status(400).json({
        success: false,
        error: "Invalid token format"
      });
    }

    // Verify Google token with error handling
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
        // Add this for additional validation:
        issuer: [
          'https://accounts.google.com',
          'accounts.google.com'
        ]
      });
    } catch (verifyErr) {
      console.error("Token verification error:", verifyErr);
      return res.status(401).json({
        success: false,
        error: "Invalid Google token",
        details: verifyErr.message
      });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid token payload"
      });
    }

    const { sub, name, email, picture } = payload;

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
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined, // Don't set domain for localhost
      maxAge: 3600000
    });

    return res.status(200).json({
      success: true,
      user: { name, email, picture },
      redirect: "/home"
    });

  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({
      success: false,
      error: "Authentication failed",
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

module.exports = router;