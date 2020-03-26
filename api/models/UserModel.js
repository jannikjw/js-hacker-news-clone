const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, lowercase: true, required: true},
	username: {type: String, lowercase: true, required: true},
    password: {type: String, required: true},
    
    // has the user confirmed their email?
	isConfirmed: {type: Boolean, required: true, default: 0},
    confirmOTP: {type: String, required:false},
    otpTries: {type: Number, required:false, default: 0},
    
    // is the user active (setting this to false in the database allows us to blacklist users)
	status: {type: Boolean, required: true, default: 1}
}, {
	timestamps: true,
	toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// Virtual for user's full name
UserSchema.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

// hide some fields from the API reponse
UserSchema.method('toJSON', function() {
	let obj = this.toObject()
	delete obj.id
	delete obj.password
	delete obj.isConfirmed
	delete obj.confirmOTP
	delete obj.otpTries
	delete obj.status
	return obj
});

module.exports = mongoose.model("User", UserSchema);
