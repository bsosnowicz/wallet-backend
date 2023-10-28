const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./router/user");
const balanceRouter = require("./router/balance");
const cryptoRouter = require("./router/cryptoBalance");
mongoose.Promise = global.Promise;
require("./config/config-passport");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/", router);
app.use("/balance", balanceRouter);
app.use("/crypto", cryptoRouter);

app.use((req, res) => {
  res.status(404).json({ message: "not found" });
});

module.exports = app;
