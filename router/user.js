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
      return res.json({
        status: 409,
        code: 409,
        data: "Conflict",
        message: "email in use",
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

    const newBalance = new Balance({
      _id: id,
      balance: 0,
      transactionHistory: {
        date: new Date().toISOString(),
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
  try {
    const user = await User.findOne({ email });
    if (!user || !user.validPassword(password)) {
      return res.json({
        status: "error",
        code: 401,
        data: "Bad request",
        message: "Incorrect password/login",
      });
    }
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
