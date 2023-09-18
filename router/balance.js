const express = require("express");
const Balance = require("../schemas/balance");
const router = express.Router();
const passport = require("passport");

const currentDate = new Date();

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
  try {
    const userWallet = await Balance.findOne({ _id: userId });
    res.json({
      status: "success",
      code: 200,
      data: { userWallet },
    });
  } catch (e) {
    console.log(e.message);
  }
});

router.put("/deposit", auth, async (req, res, next) => {
  const { amount, title } = req.body;
  const userId = req.user._id;
  const currentWallet = await Balance.findOne({ _id: userId });
  const currentBalance = currentWallet.balance + amount;

  const newTransaction = {
    date: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")} ${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`,
    title: title,
    type: "Deposit",
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
  const { amount, title } = req.body;
  const userId = req.user._id;
  const currentWallet = await Balance.findOne({ _id: userId });
  const currentBalance = currentWallet.balance - amount;

  const newTransaction = {
    date: `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")} ${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`,
    title: title,
    type: "Withdraw",
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
router.put("/clearhistory", auth, async (req, res, next) => {
  const userId = req.user._id;
  try {
    const userWallet = await Balance.findOne({ _id: userId });

    const clearedHistory = userWallet.transactionHistory.filter(
      (transaction) => transaction.title === "Account registered!"
    );

    userWallet.transactionHistory = clearedHistory;

    await userWallet.save();
    res.json({
      code: 200,
      status: "success",
      data: { userWallet },
    });
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
