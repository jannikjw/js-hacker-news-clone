const { chai, server, expect } = require('../testConfig');
const UserModel = require('../../models/UserModel');
const ResetTokenModel = require('../../models/ResetTokenModel');

// -----------------------------
// Test send-reset-password Route
// -----------------------------
const testSuite = describe('/POST send-reset-password', () => {
	// Prepare data for testing
	const testData = {
		'firstName':'Jon',
		'lastName':'Doe',
		'email':'m.froehlich1994@gmail.com',
		'username':'doej',
		'password':'password123'
	};
	let testUser = null;

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
							done();	
						})
						.catch(err => {
							throw err;
						})
					
				});     
		});        
	});


	it('empty body should fail', (done) => {
		chai.request(server)
			.post('/api/auth/send-reset-password')
			.send({ })
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('invalid email should fail', (done) => {
		const payload = {
			email: 'abcd'
		}
		chai.request(server)
			.post('/api/auth/send-reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});


	it('non-existing email should fail', (done) => {
		const payload = {
			email: 'froehlich@cdtm.de'
		}
		chai.request(server)
			.post('/api/auth/send-reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});

	it('(Success Case) should send password reset link', (done) => {
		const payload = {
			email: testUser.email
		}
		chai.request(server)
			.post('/api/auth/send-reset-password')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(200);
				ResetTokenModel.findOne({email: testUser.email})
					.then(resetToken => {
						expect(resetToken).to.be.a('object');
						expect(resetToken).to.have.property('email');
						expect(resetToken).to.have.property('token');
						expect(resetToken.email).to.not.equal(null);
						expect(resetToken.token).to.not.equal(null);
						done();
					})
					.catch(err => {
						throw err;
					});
		});
	});
});

module.exports = { testSuite }
