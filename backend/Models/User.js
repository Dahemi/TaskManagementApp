const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  //task field defined as an array of refernces to Task Model
  tasks: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task", //establish a relationship to Task Model
  },
});

//

module.exports = mongoose.model("User", userSchema);
