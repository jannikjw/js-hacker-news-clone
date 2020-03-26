const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const indexRouter = require("./routes/index");

const apiResponse = require("./helpers/apiResponse");


const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/", indexRouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

module.exports = app;
