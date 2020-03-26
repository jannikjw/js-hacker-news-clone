const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResetTokenSchema = new Schema({
	token: {type: String, required: true},
	email: {type: String, required: true},
	sentAt: {type: Date, required: false}
}, {timestamps: true});

module.exports = mongoose.model("ResetToken", ResetTokenSchema);
