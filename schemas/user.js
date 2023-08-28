const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  _id: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
