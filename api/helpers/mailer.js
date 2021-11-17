const nodemailer = require("nodemailer");

const FROM_EMAIL = process.env.EMAIL_SMTP_SENDER_EMAIL;
const WEB_APP_HOST = process.env.WEB_APP_HOST;

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_SMTP_HOST,
	port: process.env.EMAIL_SMTP_PORT,
	//secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
	}
});

exports.send = function (from, to, subject, html)
{

	// make sure emails are not sent during testing
	if (process.env.NODE_ENV === 'test' ) {
		return new Promise((resolve, reject) => {
			return resolve(true);
		});
	}

	// send mail with defined transport object
	// visit https://nodemailer.com/ for more options
	return transporter.sendMail({
		from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
		to: to, // list of receivers e.g. bar@example.com, baz@example.com
		subject: subject, // Subject line e.g. 'Hello ✔'
		//text: text, // plain text body e.g. Hello world?
		html: html // html body e.g. '<b>Hello world?</b>'
	});
};

exports.sendAsync = function (from, to, subject, html)
{
    return new Promise((resolve, reject) => {

		// make sure emails are not sent during testing
		if (process.env.NODE_ENV === 'test' ) {
			return resolve(true);
		}

		return transporter.sendMail({
			from: from, // sender address e.g. no-reply@xyz.com or "Fred Foo 👻" <foo@example.com>
			to: to, // list of receivers e.g. bar@example.com, baz@example.com
			subject: subject, // Subject line e.g. 'Hello ✔'
			//text: text, // plain text body e.g. Hello world?
			html: html // html body e.g. '<b>Hello world?</b>'
		}, function(error, info) {
			if (error) {
			   	resolve(false); // or use rejcet(false) but then you will have to handle errors
			} 
			else {
				resolve(true);
			}
		})
	   });
};


exports.sendOTPEmail = function (to, otp) {
	return new Promise((resolve, reject) => {
		const verifyUrl = `${WEB_APP_HOST}/verify?email=${to}&otp=${otp}&s=1`
		const html = `
			<p>Please Confirm your Account.</p>
			<p>Code: <strong>${otp}</strong></p>
			<br>
			<p>
				<a href="${verifyUrl}" target="_blank">Click here to confirm</a>
			<p/>`;

		// Send confirmation email
		exports.send(
			FROM_EMAIL, 
			to,
			"Confirm Account",
			html
		).then(()=> {
			resolve()
		}).catch(err => {
			reject()
		});
	})
}


exports.sendPasswordResetEmail = function(to, token) {
	return new Promise((resolve, reject) => {
		const resetUrl = `${WEB_APP_HOST}/reset-password?token=${token}`
		const html = `
			<p>Reset your password.</p>
			<p>
				<a href="${resetUrl}" target="_blank">
					Click here to reset your password.
				</a>
			<p/>`;

		// Send confirmation email
		exports.send(
			FROM_EMAIL,
			to,
			"Reset Password",
			html
		).then(()=> {
			resolve()
		}).catch(err => {
			reject()
		});
	})
}
