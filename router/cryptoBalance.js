const express = require("express");
const cryptoBalance = require("../schemas/cryptoBalance");
const router = express.Router();
const passport = require("passport");

const currentDate = new Date();

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err || user.token === null) {
      res.status(401).json({
        status: "error",
        message: "Unautrhorized",
        data: "unauthorized",
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

router.post("/create", auth, async (req, res, next) => {
  const userId = req.user._id;
  try {
    const newCryptoBalance = new cryptoBalance({
      _id: userId,
      cyptoWallet: {
        currency: "BTC",
        balance: 0,
        transactionHistory: {
          date: new Date(),
          title: "Account registered!",
        },
      },
    });
    await newCryptoBalance.save();
    res.status(200).json({
      message: "success",
      data: { newCryptoBalance },
    });
  } catch (e) {
    console.log(e.message);
  }
});

router.get("/", auth, async (req, res, next) => {
  const userId = req.user._id;
  try {
    const cryptoWallet = await cryptoBalance.findOne({ _id: userId });
    if (!cryptoWallet) {
      res.status(400).json({
        message: "You don't have any crypto wallet!",
      });
    } else {
      res.status(200).json({
        message: "success",
        data: { cryptoWallet },
      });
    }
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;
