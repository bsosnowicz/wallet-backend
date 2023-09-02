const express = require("express");
const Balance = require("../schemas/balance");
const router = express.Router();
const passport = require("passport");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || user.token === null) {
      res.status(401).json({
        status: "error",
        code: 401,
        message: "Unautrhorized",
        data: "unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.get("/", auth, async (req, res, next) => {
  const userId = req.user._id;
  const userWallet = await Balance.findOne({ _id: userId });
  res.status(200).json({
    status: "success",
    code: 200,
    data: { userWallet },
  });
});

router.put("/deposit", auth, async (req, res, next) => {
  const { amount } = req.body;
  const userId = req.user._id;
  const currentWallet = await Balance.findOne({ _id: userId });
  const currentBalance = currentWallet.balance + amount;

  const newTransaction = {
    date: new Date().toISOString(),
    title: "Deposit",
    type: "deposit",
    amount: amount,
  };
  try {
    currentWallet.transactionHistory.push(newTransaction);
    const updatedBalance = await Balance.findByIdAndUpdate(
      userId,
      {
        balance: currentBalance,
        transactionHistory: currentWallet.transactionHistory,
      },

      { new: true }
    );

    res.json({
      code: 200,
      status: "success",
      data: { updatedBalance },
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.put("/withdraw", auth, async (req, res, next) => {
  const { amount } = req.body;
  const userId = req.user._id;
  const currentWallet = await Balance.findOne({ _id: userId });
  const currentBalance = currentWallet.balance - amount;

  const newTransaction = {
    date: new Date().toISOString(),
    title: "Withdraw",
    type: "withdraw",
    amount: amount,
  };

  try {
    currentWallet.transactionHistory.push(newTransaction);
    const updatedBalance = await Balance.findByIdAndUpdate(
      userId,
      {
        balance: currentBalance,
        transactionHistory: currentWallet.transactionHistory,
      },

      { new: true }
    );

    res.json({
      code: 200,
      status: "success",
      data: { updatedBalance },
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
