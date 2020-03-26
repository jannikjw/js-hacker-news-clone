/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Register
 * (2) Verify OTP
 * (3) Request New OTP
 * (4) Login
 * (5) Get User (Authentication Required)
 * (6) Update the User
 * (7) Update Password
 * (8) Request Password Reset Link
 * (9) Reset Password With Token
 */
describe('AUTH', () => {

	require('./auth/register.test')
	require('./auth/verify.test')
	require('./auth/resendcode.test')
	require('./auth/login.test')
	require('./auth/getuser.test')
	require('./auth/updateuser.test')
	require('./auth/updatepassword.test')
	require('./auth/sendresetpassword.test')
	require('./auth/resetpassword.test')

});
