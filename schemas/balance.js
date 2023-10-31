const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: { type: String },
  title: { type: String },
  type: { type: String },
  amount: { type: Number },
});

const balanceSchema = new Schema({
  _id: { type: String },
  balance: { type: Number },
  transactionHistory: [transactionSchema],
});

const Balance = mongoose.model("Balance", balanceSchema, "balance");

module.exports = Balance;
