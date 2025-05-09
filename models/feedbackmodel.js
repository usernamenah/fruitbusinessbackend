
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    feedback: [
        {
          message: { type: String, required: true },
          date: { type: Date, default: Date.now }
        }
      ]
});

const getinfo = mongoose.model("user", UserSchema, "feedbackbase");

module.exports=getinfo;