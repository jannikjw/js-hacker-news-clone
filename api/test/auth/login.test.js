const { chai, server, expect } = require('./../testConfig');
const UserModel = require('../../models/UserModel');
    
// -----------------------------
// Test Login Route
// -----------------------------
const testSuite = describe('/POST login', () => {
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

    it('not confirmed accounts should be rejected.', (done) => {
        const { email, password } = testData;
        chai.request(server)
            .post('/api/auth/login')
            .send({ email, password })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').eql('Account is not confirmed. Please check your mail account.');
                done();
            });
    });

    it('wrong email should be rejected', (done) => {
        let { email, password } = testData;
        email = 'froehlich@cdtm.de'
        chai.request(server)
            .post('/api/auth/login')
            .send({ email, password })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });


    it('wrong password should be rejected', (done) => {
        let { email, password } = testData;
        password = 'xxx'
        chai.request(server)
            .post('/api/auth/login')
            .send({ email, password })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });


    it('(Success Case) Login should succeed', (done) => {
        testUser.isConfirmed = true;
        testUser.save()
            .then(user => {
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
                        done();
                    });
            })
            .catch(err => {
                throw err;
            });
    });

});

module.exports = { testSuite }

