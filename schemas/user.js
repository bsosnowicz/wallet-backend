const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = Schema({
  _id: { type: String },
  username: { type: String, required: [true, "Set username"] },
  email: { type: String, required: [true, "Set email"] },
  password: { type: String, required: [true, "Set password"] },
  token: String,
  balance: Number,
});

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema, "user");

module.exports = User;
