const { chai, server, expect } = require('./../testConfig');
const UserModel = require('../../models/UserModel');

// -----------------------------
// (3) Test verify-otp Route
// -----------------------------
const testSuite = describe('/POST verify-otp', () => {
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
							expect(user).to.be.a('object')
							expect(user).to.have.property('_id')
							expect(user).to.have.property('confirmOTP')
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
			.post('/api/auth/verify-otp')
			.send({ })
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});


	it('non-existing email should fail', (done) => {
		const payload = {
			email: 'froehlich@cdtm.de',
			otp: testUser.confirmOTP
		}
		chai.request(server)
			.post('/api/auth/verify-otp')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});

	it('wrong otp hould fail', (done) => {
		const payload = {
			email: testUser.email,
			otp: '1234' // in rare cases this test might fail, because we actually hit the otp
		}
		chai.request(server)
			.post('/api/auth/verify-otp')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(401);
				done();
			});
	});

	it('(Success Case) right otp should work', (done) => {
		const payload = {
			email: testUser.email,
			otp: testUser.confirmOTP
		}
		chai.request(server)
			.post('/api/auth/verify-otp')
			.send(payload)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('data');
				res.body.data.should.have.property('firstName').eql(testUser.firstName);
				res.body.data.should.have.property('lastName').eql(testUser.lastName);
				res.body.data.should.have.property('username').eql(testUser.username);
				res.body.data.should.have.property('email').eql(testUser.email);
				res.body.data.should.have.property('token');

				UserModel.findById(testUser._id)
					.then(refreshedUser => {
						expect(refreshedUser).to.have.property('isConfirmed')
						expect(refreshedUser.isConfirmed).to.equal(true)
						expect(refreshedUser).to.have.property('confirmOTP')
						expect(refreshedUser.confirmOTP).to.equal(null)
						done();
					})
					.catch(err => {
						throw err;
					})

				
			});
	});

});

module.exports = { testSuite }
