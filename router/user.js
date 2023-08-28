const express = require("express");
const User = require("../schemas/user");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const data = await User.findOne({});
  return res.status(200).json(data);
});

module.exports = router;
