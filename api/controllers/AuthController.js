
const UserModel = require("../models/UserModel");
const ResetTokenModel = require("../models/ResetTokenModel");

const { body } = require("express-validator");
const bcrypt = require("bcrypt-nodejs");
const rejectRequestsWithValidationErrors = require("../middleware/rejectRequestsWithValidationErrors");
const authenticationRequired = require("../middleware/authenticationRequired");

const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const mailer = require("../helpers/mailer");
const crypto = require('crypto');


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


			});

		} catch (err) {
			//throw error in json response with status 500.
			return apiResponse.ErrorResponse(res, err);
		}
    }];


/**
 * Verify an Account with a one time password (OTP).
 *
 * @param {string}      email
 * @param {string}      otp
 *
 * @returns {Object}
 */
exports.verifyAccount = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("otp").isLength({ min: 1 }).trim().withMessage("OTP must be specified."),
	rejectRequestsWithValidationErrors,
	(req, res) => {
		try {
			const query = {email : req.body.email};
			UserModel.findOne(query).then(user => {
				if (!user) {
					return apiResponse.unauthorizedResponse(res, "Specified email not found.");
				}
				if (user.isConfirmed){
					return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
				}
				if (user.confirmOTP != req.body.otp){
					return apiResponse.unauthorizedResponse(res, "Verification code does not match");
				}

				// If we are here, the code matches
				UserModel.findOneAndUpdate(query, {
					isConfirmed: 1,
					confirmOTP: null 
				}, (err, updatedUser) => {
					if (err) { return apiResponse.ErrorResponse(res, err); }

					utility.jwtForUser(updatedUser)
					.then(userData => {
						return apiResponse.successResponseWithData(res,"Account confirmed.", userData);
					}).catch(err => {
						return apiResponse.successResponseWithData(res,"Account confirmed.", null);
					})
				});

			});

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];




/**
 * Resend the verification email with the one time passord (OTP).
 *
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.resendVerificationCode = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	rejectRequestsWithValidationErrors,
	(req, res) => {
		try {
			const query = {email : req.body.email};
			UserModel.findOne(query, (err, user) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }

				if (!user) {
					return apiResponse.unauthorizedResponse(res, "Email not found.");
				}
				if (user.isConfirmed) {
					return apiResponse.unauthorizedResponse(res, "Account already confirmed.");
				}

				// Generate new otp
				let otp = utility.randomNumber(4);
				mailer.sendOTPEmail(user.email, otp).then(()=> {
					user.isConfirmed = false;
					user.confirmOTP = otp;
					user.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }
						return apiResponse.successResponse(res,"Verification code sent.");
					});
				}).catch(err => {
					return apiResponse.ErrorResponse(res, err);
				});
			});

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * Signs in a user and return a Json Web Token (jwt).
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified."),
	rejectRequestsWithValidationErrors,
	(req, res) => {
		try {
			UserModel.findOne({email : req.body.email}, (err, user) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }

				if (!user) {
					return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
				}

				//Compare given password with db's hash.
				bcrypt.compare(req.body.password, user.password, function (err,same) {
					if(!same) {
						return apiResponse.unauthorizedResponse(res, "Email or Password wrong.");
					}
					//Check account confirmation.
					if(!user.isConfirmed){
						return apiResponse.unauthorizedResponse(res, "Account is not confirmed. Please check your mail account.");
					}
					// Check User's account active or not.
					if(!user.status) {
						return apiResponse.unauthorizedResponse(res, "Account is not active. Please contact admin.");
					}
					utility.jwtForUser(user).then(userData => {
						apiResponse.successResponseWithData(res,"Login Success.", userData);
					}).catch(error => {
						return apiResponse.ErrorResponse(res,"Internal Server Error.");
					})
				});
				
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * Send reset password link
 *
 * @param {string}      email
 *
 * @returns {Object}
 */
exports.sendResetPassword = [
	body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
		.isEmail().withMessage("Email must be a valid email address."),
	rejectRequestsWithValidationErrors,
	(req, res) => {
		try {
			const query = {email : req.body.email};
			UserModel.findOne(query).then(user => {
				if (!user) {
					return apiResponse.unauthorizedResponse(res, "Specified email not found.");
				}
				// Delete all previous tokens for this user
				ResetTokenModel.deleteMany(query).then(() => {
					// Generate random token
					const token = crypto.randomBytes(32).toString('hex');
					// Store reset token
					let resetToken = new ResetTokenModel(
						{
							token: token,
							email: user.email,
							sentAt: null
						}
					);
					
					// Save the reset token
					resetToken.save(function (err) {
						if (err) { return apiResponse.ErrorResponse(res, err); }

						// Send password reset email
						mailer.sendPasswordResetEmail(user.email, token)
						.then(()=> {
							resetToken.sentAt = new Date();
							// Save the reset token
							resetToken.save(function (err) {
								if (err) { return apiResponse.ErrorResponse(res, err); }
								return apiResponse.successResponse(res,"Reset link sent.");
							});
						}).catch(err => {
							return apiResponse.ErrorResponse(res, err);
						})
					});
				});		
	
			});

		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * Reset a password with a valid token
 *
 * @param {string}      token
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.resetPassword = [
	body("token").isLength({ min: 1 }).trim()
		.withMessage("Token must be specified."),
	body("token").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	body("password").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	rejectRequestsWithValidationErrors,
	(req, res) => {
		try {
			let query = {token : req.body.token};
			ResetTokenModel.findOne(query, null, { sort: { 'sentAt' : -1 } }).then(resetToken => {
				if (!resetToken) {
					return apiResponse.unauthorizedResponse(res, "Token not found.");
				}

				let userQuery = {email : resetToken.email }
				UserModel.findOne(userQuery).then(user => {
					if (!user) {
						return apiResponse.unauthorizedResponse(res, "Token invalid.");
					}
					//hash input password
					bcrypt.hash(req.body.password,null,null,function(err, hash) {
						user.password = hash
						// Save the user
						user.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							resetToken.remove(function(err){
								if (err) { return apiResponse.ErrorResponse(res, err); }
								return apiResponse.successResponse(res,"Password succesfully set.");
							});
						});
					})
				})
			});
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


// ----------------------------------------------------
// -> For the routes below authentication is required. 
// ---------------------------------------------------	

/**
 * Returns the logged in user.
 * 
 * @returns {Object}
 */
exports.getCurrentUser = [
	authenticationRequired, // make sure the user is logged in
	(req, res) =>  {
		try {
			UserModel.findOne({_id : req.user._id}, (err, user) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }

				if (!user) {
					return apiResponse.unauthorizedResponse(res, "User not found.");
				}

				// Try to refresh the JWT for the user
				utility.jwtForUser(user).then(userData => {
					apiResponse.successResponseWithData(res,"User found.", userData);
				}).catch(error => {
					return apiResponse.successResponseWithData(res, "User found.", user);
				})

			});
			
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];


/**
 * Update user account of an authenticated user.
 * 
 * @param {string}      firstName
 * @param {string}      lastName
 * 
 * Note: The username and the email of the user are permanent for now.
 * 
 * @returns {Object}
 */
exports.updateUser = [
	authenticationRequired, // make sure the user is logged in
	body("firstName").isLength({ min: 1 }).trim().withMessage("First name must be specified.")
		.isAlphanumeric().withMessage("First name has non-alphanumeric characters."),
	body("lastName").isLength({ min: 1 }).trim().withMessage("Last name must be specified.")
		.isAlphanumeric().withMessage("Last name has non-alphanumeric characters."),
	rejectRequestsWithValidationErrors,
	(req, res) =>  {
		try {
			UserModel.findOne({_id : req.user._id}, (err, user) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }

				if (!user) {
					return apiResponse.unauthorizedResponse(res, "User not found.");
				}

				user.firstName = req.body.firstName;
				user.lastName = req.body.lastName;

				user.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }

					return apiResponse.successResponseWithData(res, "User updated.", user);
				});

			});
			
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];
	


/**
 * Update the password of the authenticated user.
 * 
 * @param {string}      currentPassword
 * @param {string}      password
 * 
 * @returns {Object}
 */
exports.updatePassword = [
	authenticationRequired, // make sure the user is logged in
	body("password", "Your current password is required.").isLength({ min: 1 }).trim(),
	body("newPassword").isLength({ min: 6 }).trim().withMessage("Password must be 6 characters or greater."),
	rejectRequestsWithValidationErrors,
	(req, res) =>  {
		try {
			UserModel.findOne({_id : req.user._id}, (err, user) => {
				if (err) { return apiResponse.ErrorResponse(res, err); }

				if (!user) {
					return apiResponse.unauthorizedResponse(res, "User not found.");
				}

				bcrypt.compare(req.body.password, user.password, function (err, same) {
					if (err) {
						return apiResponse.ErrorResponse(res, err);
					}

					if (!same) {
						return apiResponse.validationErrorWithData(res, "Password wrong.", null);
					}

					bcrypt.hash(req.body.newPassword,null,null,function(err, hash) {
						user.password = hash
						user.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }

							return apiResponse.successResponse(res,"New password successfully set.");
						});
					});
				});
			});
			
		} catch (err) {
			return apiResponse.ErrorResponse(res, err);
		}
	}];

