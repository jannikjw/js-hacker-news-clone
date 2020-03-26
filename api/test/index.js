/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Register
 */
describe('AUTH', () => {

	require('./auth/register.test')
	require('./auth/verify.test')
	require('./auth/resendcode.test')

});
