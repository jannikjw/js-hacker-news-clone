const nodemailer = require("nodemailer");

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
