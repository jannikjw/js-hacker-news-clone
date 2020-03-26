const { chai, server, expect } = require('../testConfig');
const UserModel = require('../../models/UserModel');
const ResetTokenModel = require('../../models/ResetTokenModel');

// -----------------------------
// Test reset-password Route
// -----------------------------
const testSuite = describe('/POST reset-password', () => {
	// Prepare data for testing
	const testData = {
		'firstName':'Jon',
		'lastName':'Doe',
		'email':'m.froehlich1994@gmail.com',
		'username':'doej',
		'password':'password123'
	};
	let testUser = null;
	let testResetToken = null;

	// Before each test we empty the database and create a new user.
	before((done) => { 
		UserModel.deleteMany({}, (err) => { 

			// first create a new user
			chai.request(server)
				.post('/api/auth/register')
				.send(testData)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('message').eql('Registration Success.');
					UserModel.findById(res.body.data._id)
						.then(user => {
							expect(user).to.be.a('object');
							expect(user).to.have.property('_id');
							expect(user).to.have.property('confirmOTP');
							testUser = user;

							// get a reset token for the user
							chai.request(server)
								.post('/api/auth/send-reset-password')
								.send({email: testUser.email})
								.end((err, res) => {
									res.should.have.status(200);
									ResetTokenModel.findOne({email: testUser.email})
										.then(resetToken => {
											expect(resetToken).to.be.a('object');
											expect(resetToken).to.have.property('email');
											expect(resetToken).to.have.property('token');
											expect(resetToken.email).to.not.equal(null);
											expect(resetToken.token).to.not.equal(null);
											testResetToken = resetToken;
											done();
										})
										.catch(err => {
											throw err;
										});
							});
						})
						.catch(err => {
							throw err;
						})
					
				});     
		});        
	});


	it('empty body should fail', (done) => {
		chai.request(server)
			.post('/api/auth/reset-password')
			.send({})
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('missingToken should fail', (done) => {
		const payload = {
			password: 'newPassword'
		}
		chai.request(server)
			.post('/api/auth/reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('missingToken should fail', (done) => {
		const payload = {
			token: testResetToken.token,
		}
		chai.request(server)
			.post('/api/auth/reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('too short password should fail', (done) => {
		const payload = {
			token: testResetToken.token,
			password: 'x'
		}
		chai.request(server)
			.post('/api/auth/reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});


	it('invalid token should fail', (done) => {
		const payload = {
			token: 'csdhjvbsdjhvb',
			password: 'newPassword'
		}
		chai.request(server)
			.post('/api/auth/reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});

	it('(Success Case) valid token should change password', (done) => {
		const payload = {
			token: testResetToken.token,
			password: 'newPassword'
		}
		const currentPasswordHash = testUser.password;
		chai.request(server)
			.post('/api/auth/reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(200);
				UserModel.findOne({_id: testUser._id})
					.then(refreshedUser => {
						expect(refreshedUser).to.be.a('object');
						expect(refreshedUser).to.have.property('password');
						expect(refreshedUser.password).to.not.equal(currentPasswordHash);
						done();
					})
					.catch(err => {
						throw err;
					});
			});
		});

		it('tokens should be usable only once', (done) => {
			const payload = {
				token: testResetToken.token,
				password: 'newPassword'
			}
			chai.request(server)
				.post('/api/auth/reset-password')
				.send(payload)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});

		});
});

module.exports = { testSuite }
