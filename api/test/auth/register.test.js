const { chai, server } = require('../testConfig');
const UserModel = require('../../models/UserModel');
    
// -----------------------------
// (1) Test Register Route
// -----------------------------
const testSuite = describe('/POST register', () => {

	// Prepare data for testing
	const testData = {
		'firstName':'Jon',
		'lastName':'Doe',
		'email':'m.froehlich1994@gmail.com',
		'username':'doej',
		'password':'password123'
	};


	// Before each test we empty the database
	before((done) => { 
		UserModel.deleteMany({}, (err) => { 
			done();           
		});        
	});


	it('empty body should result in validation error', (done) => {
		chai.request(server)
			.post('/api/auth/register')
			.send({})
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('missing username and password should result in validation error', (done) => {
		const { firstName, lastName, email} = testData;
		chai.request(server)
			.post('/api/auth/register')
			.send({ firstName, lastName, email })
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('missing firstName, lastName and email should result in validation error', (done) => {
		const { username, password } = testData;
		chai.request(server)
			.post('/api/auth/register')
			.send({ username, password })
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('invalid email should result in validation error', (done) => {
		let failingTestData = JSON.parse(JSON.stringify(testData));
		failingTestData.email = 'abcd'
		chai.request(server)
			.post('/api/auth/register')
			.send(failingTestData)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('too short password should result in validation error', (done) => {
		let failingTestData = JSON.parse(JSON.stringify(testData));
		failingTestData.password = 'p'
		chai.request(server)
			.post('/api/auth/register')
			.send(failingTestData)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('(Success Case) should register the user', (done) => {
		chai.request(server)
			.post('/api/auth/register')
			.send(testData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.have.property('message').eql('Registration Success.');
				testData._id = res.body.data._id;
				done();
			});
	});

	it('existing email should result in validation error', (done) => {
		let failingTestData = JSON.parse(JSON.stringify(testData));
		failingTestData.username = 'xxxx'
		chai.request(server)
			.post('/api/auth/register')
			.send(failingTestData)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});
	});

	it('existing username should result in validation error', (done) => {
		let failingTestData = JSON.parse(JSON.stringify(testData));
		failingTestData.email = 'froehlich@cdtm.de'
		chai.request(server)
			.post('/api/auth/register')
			.send(failingTestData)
			.end((err, res) => {
				res.should.have.status(400);
				done();
			});

	});
});
    
module.exports = { testSuite }
