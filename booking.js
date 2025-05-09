const express = require('express');
const router = express.Router();
const Order = require('./models/bookingmodel');

router.post('/place', async (req, res) => {
  try {
    const { bowl, juices, coldPressed } = req.body;
    const email = req.cookies.emailnamefororder;
    console.log(email);

    if (!email) {
      return res.status(400).json({ message: "Email not found in cookies" });
    }

    const order = new Order({
      email,
      bowl,
      juices,
      coldPressed
    });

    await order.save();

    res.status(201).json({ message: 'Order saved successfully' });
  } catch (error) {
    console.error("Order saving failed:", error);
    res.status(500).json({ message: 'Error saving order' });
  }
});


router.get('/get', async (req, res) => {
  const { email } = req.cookies.emailnamefororder;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const orders = await OrderModel.find({ email });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
