var express = require("express");
var authRouter = require("./authRouter");

var app = express();

app.use("/auth/", authRouter);

module.exports = app;
