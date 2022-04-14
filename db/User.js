const mongoose = require("mongoose");

// defining schema
const userSchema  = new mongoose.Schema({
  name:String, 
  email:String, 
  password:String
});


module.exports = mongoose.model("users", userSchema)
