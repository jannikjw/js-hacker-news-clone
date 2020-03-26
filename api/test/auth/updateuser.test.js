const { chai, server, expect } = require('../testConfig');
const UserModel = require('../../models/UserModel');

// -----------------------------
// Test update user route
// -----------------------------
const testSuite = describe('/PATCH user', () => {
	// Prepare data for testing
	const testData = {
		'firstName':'Jon',
		'lastName':'Doe',
		'email':'m.froehlich1994@gmail.com',
		'username':'doej',
		'password':'password123'
	};
	let testUser = null;
	let testToken = null;
	let updatedFirstName = 'Michael';
	let updatedLastName = 'Froehlich';


	// Before each test we empty the database and create a new user.
	before((done) => { 

		const registerUser = function() {
			return new Promise((resolve, reject) => {
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

						resolve(user)
					})
					.catch(err => {
						reject(err)
					})
				});
			});
		} 

		const confirmUser = function() {
			return new Promise((resolve, reject) => {
				testUser.isConfirmed = true;
				testUser
				.save()
				.then(user => {
					resolve(user);
				})
				.catch(err => {
					reject(err);
				})
			});
		}

		const loginUser = function() {
			return new Promise((resolve, reject) => {
				const { email, password } = testData;
                chai.request(server)
				.post('/api/auth/login')
				.send({ email, password })
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('data');
					res.body.data.should.have.property('firstName').eql(testUser.firstName);
					res.body.data.should.have.property('lastName').eql(testUser.lastName);
					res.body.data.should.have.property('username').eql(testUser.username);
					res.body.data.should.have.property('email').eql(testUser.email);
					res.body.data.should.have.property('token');

					resolve(res.body.data.token);
				});
			});
		}



		UserModel.deleteMany({}, (err) => { 
			
			// first create a new user
			registerUser().then(user => {
				testUser = user;
			})
			.then(confirmUser).then(user => {
				testUser = user;
			})
			.then(loginUser).then(authToken => {
				testToken = authToken;
				done();
			});
		});
	});        

	it('should reject access without access token', (done) => {
		chai.request(server)
		.patch('/api/auth/update')
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

	it('should reject access with an invalid access token', (done) => {
		chai.request(server)
		.patch('/api/auth/update')
		.set({ 'Authorization': `Bearer cdsbfdsbj`, Accept: 'application/json' })
		.end((err, res) => {
			res.should.have.status(401);
			done();
		});
	});

	it('empty body should result in validation error', (done) => {
		const payload = {};
		chai.request(server)
		.patch('/api/auth/update')
		.send(payload)
		.set({ 'Authorization': `Bearer ${testToken}`, Accept: 'application/json' })
		.end((err, res) => {
			res.should.have.status(400);
			done();
		});
	});

	it('missing firstName should result in validation error', (done) => {
		const payload = {
			lastName: updatedLastName
		};
		chai.request(server)
		.patch('/api/auth/update')
		.send(payload)
		.set({ 'Authorization': `Bearer ${testToken}`, Accept: 'application/json' })
		.end((err, res) => {
			res.should.have.status(400);
			done();
		});
	});

	it('missing lastName should result in validation error', (done) => {
		const payload = {
			firstName: updatedFirstName
		};
		chai.request(server)
		.patch('/api/auth/update')
		.send(payload)
		.set({ 'Authorization': `Bearer ${testToken}`, Accept: 'application/json' })
		.end((err, res) => {
			res.should.have.status(400);
			done();
		});
	});


	it('(Success case) should firstName and lastName for user', (done) => {
		const payload = {
			firstName: updatedFirstName,
			lastName: updatedLastName,
			password: 'newPassword'
		};
		chai.request(server)
		.patch('/api/auth/update')
		.send(payload)
		.set({ 'Authorization': `Bearer ${testToken}`, Accept: 'application/json' })
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.have.property('data');
			res.body.data.should.have.property('firstName').eql(updatedFirstName);
			res.body.data.should.have.property('lastName').eql(updatedLastName);
			done();
		});
	});

	it('password should not be different', (done) => {
		const payload = {
			email: testData.email,
			password: testData.password
		};
		chai.request(server)
		.post('/api/auth/login')
		.send(payload)
		.end((err, res) => {
			res.should.have.status(200);
			done();
		});
	});
});

module.exports = { testSuite }
