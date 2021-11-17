var express = require("express");
var authRouter = require("./authRouter");
var postRouter = require("./postRouter");

var app = express();

app.use("/auth/", authRouter);
app.use("/posts/", postRouter);

module.exports = app;
