require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { OAuth2Client } = require("google-auth-library");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/authDB";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "your_google_client_id";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);




const getinfo = require('./getinfo.js');


// CORS Configuration
app.use(
    cors({
        origin: "https://fruitbusiness.vercel.app",
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
// app.use((req, res, next) => {
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//     res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//     next();
// });

// Middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema & Model

// const User = mongoose.model("User", UserSchema, "googlecreds");

app.use('/api', getinfo);

// Authentication Middleware
const authenticate = (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        req.userId = decoded.userId;
        next();
    });
};

//suth check 


app.get("/check-auth", authenticate, (req, res) => {
    res.json({ isAuth: true });
  });

app.get("/home", authenticate, (req, res) => {
    res.json({ message: "Welcome to the Home Page!" });
  });
// Protected Route (Example: Home Page Data)
app.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
});

// Logout Route
app.post("/logout", (req, res) => {
    res.clearCookie("authToken");
    res.json({ message: "Logged out successfully" });
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
