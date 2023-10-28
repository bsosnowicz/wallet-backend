const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  date: { type: String },
  title: { type: String },
  type: { type: String },
  amount: { type: Number },
});

const walletSchema = new Schema({
  currency: { type: String },
  balance: { type: Number },
  transactionHistory: [transactionSchema],
});

const cryptoSchema = new Schema({
  _id: { type: String },
  cryptoWallet: [walletSchema],
});

const cryptoBalance = mongoose.model(
  "cryptoBalance",
  cryptoSchema,
  "cryptoBalance"
);

module.exports = cryptoBalance;
