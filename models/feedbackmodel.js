
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    
    feedback : { type: String , required: true },
});

const getinfo = mongoose.model("user", UserSchema, "feedbackbase");

module.exports=getinfo;