const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  bowl: [String],
  juices: [String],
  coldPressed: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
