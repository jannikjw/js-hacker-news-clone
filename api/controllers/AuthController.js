
const UserModel = require("../models/UserModel");

const { body } = require("express-validator");
const bcrypt = require("bcrypt-nodejs");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");

const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const mailer = require("../helpers/mailer");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      username
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	body("username").isLength({ min: 1 }).trim().withMessage("Username must be specified.")
		.isAlphanumeric().withMessage("Username has non-alphanumeric characters.")
		.custom((value) => {
			return UserModel.findOne({username : value}).then((user) => {
				if (user) {
					return Promise.reject("Username already in use");
				}
			});
		}),
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address.")
		.custom((value) => {
			return UserModel.findOne({email : value}).then((user) => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	// reject request in case any of the validation rules are violated
	rejectRequestsWithValidationErrors,
	// Process request after validation and sanitization.
    (req, res) => {
		try {
			//hash input password
			bcrypt.hash(req.body.password,null,null,function(err, hash) {
				// generate OTP for confirmation
				let otp = utility.randomNumber(4);
				// Create User object with escaped and trimmed data
				var user = new UserModel(
					{
						firstName: req.body.firstName,
						lastName: req.body.lastName,
						username: req.body.username,
						email: req.body.email,
						password: hash,
						confirmOTP: otp
					}
				);

				// Save the user
				user.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
				});

				// Send the email, but don't wait for confirmation.
				mailer.sendOTPEmail(user.email, otp).catch(err => {})

				// return api reponse
				let userData = {
					_id: user._id,
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username,
					email: user.email
				};
				return apiResponse.successResponseWithData(res,"Registration Success.", userData);
			});

		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
    }];
