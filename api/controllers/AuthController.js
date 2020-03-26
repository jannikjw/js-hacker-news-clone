
const UserModel = require("../models/UserModel");

const { body } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");


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
    (req, res) => {
        res.json('hello world');
    }];
