const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

exports.randomNumber = function (length) {
	var text = "";
	var possible = "123456789";
	for (var i = 0; i < length; i++) {
		var sup = Math.floor(Math.random() * possible.length);
		text += i > 0 && sup == i ? "0" : possible.charAt(sup);
	}
	return Number(text);
};

exports.jwtForUser = function (user) 
{
    let userData = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
    };
    //Prepare JWT token for authentication
    const jwtPayload = userData;
    const jwtData = {
        expiresIn: process.env.JWT_TIMEOUT_DURATION,
    };
    const secret = process.env.JWT_SECRET;
    //Generated JWT token with Payload and secret.
    userData.token = jwt.sign(jwtPayload, secret, jwtData);

    return new Promise((resolve, reject) => { 
        resolve(userData);
    });
}

exports.jwtForEmail = function (email) 
{
    return UserModel.findOne({email : email})
            .then(exports.jwtForUser)
}
