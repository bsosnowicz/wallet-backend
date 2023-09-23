const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const { ulid } = require("ulid");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Balance = require("../schemas/balance");

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
    const user = await User.findOne({ _id: userId });
    return res.status(200).json(user);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.post("/register", async (req, res, next) => {
  const { username, email, password, balance } = req.body;
  const id = ulid();
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        status: "error",
        code: "409",
        message: "Email in use",
      });
    }
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        code: "400",
        message: "Username, email and password are required",
      });
    }
    const newUser = new User({ _id: id, username, email, balance });
    const verificationToken = uuidv4();

    newUser.verificationToken = verificationToken;

    const payload = {
      id: newUser.id,
    };

    newUser.setPassword(password);
    token = jwt.sign(payload, "siema", { expiresIn: "1h" });
    newUser.token = token;
    await newUser.save();
    const currentDate = new Date();

    const newBalance = new Balance({
      _id: id,
      balance: 0,
      transactionHistory: {
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
        title: "Account registered!",
      },
    });
    await newBalance.save();
    return res.status(201).json(newUser);
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      code: "400",
      message: "Both email and password are required",
    });
  }
  try {
    const user = await User.findOne({ email });

    if (!user || !user.validPassword(password)) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Incorrect password/login",
      });
    } else {
      const payload = {
        id: user.id,
      };

      const token = jwt.sign(payload, "siema", { expiresIn: "1h" });
      user.token = token;
      user.save();

      return res.json({
        status: "success",
        code: 200,
        data: { token },
      });
    }
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

router.post("/logout", auth, async (req, res, next) => {
  const user = req.user;
  try {
    user.token = null;
    user.save();
    return res.json({
      status: "success",
      code: 200,
      data: { user },
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
