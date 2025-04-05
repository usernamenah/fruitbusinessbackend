
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

const router = express.Router();

//chrephno --> ch-check re-required phno-phonenumber
router.get("/chrephno", (req, res) => {
    const token = req.cookies.chpn;

    if (!token) {
        return res.status(200).json({ authorized: false });
    }

    // You can customize this condition however you want
    // Example: token === "0" or any specific value
    if (token === "0") {
        res.status(200).json({ authorized: true });
    }
    
    return res.status(200).json({ authorized: false });
});


module.exports = router;


//check this link

// https://chatgpt.com/share/67efe863-1954-8004-b518-0e95bcb19e8d