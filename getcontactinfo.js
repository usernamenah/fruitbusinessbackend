
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());


//chrephno --> ch-check re-required phno-phonenumber
router.get("/chrephno", (req, res) => {
    const token = req.cookies.chpn;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    res.json({ message: "Access granted" });
});


module.exports = router;


//check this link

// https://chatgpt.com/share/67efe863-1954-8004-b518-0e95bcb19e8d