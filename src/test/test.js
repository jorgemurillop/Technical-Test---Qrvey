'use strict'

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const config = require('./config');

chai.use(chaiHttp);

describe('Loguin: ', () => {
    it('Get token', (done) => {

        chai.request(config.URL)
            .post('/api/signin')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                "email": "unittestQrvey123@gmail.com",
                "password": "XyZ123QWe_"
            })
            .end(function (err, res) {
                console.log(res.body);                
                expect(res).to.have.status(200);
                done();
            });

    });
});

describe('List Users: ', () => {
    it('Get users', (done) => {

        chai.request(config.URL)
            .get('/api/user')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                console.log(res.body);                
                expect(res).to.have.status(403);
                done();
            });

    });
});

describe('Authenticate a user and get list user: ', () => {
    it('Get user', (done) => {
        var agent = chai.request.agent(config.URL)

        agent.post('/api/signin')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                "email": "unittestQrvey123@gmail.com",
                "password": "XyZ123QWe_"
            })
            .end(function (err, res) {
                console.log('res.body')
                var token = res.body.token;
                
                expect(res).to.have.status(200);
                return agent.get('/api/user')
                    .set('Authorization',`Bearer ${token}`)
                    .then(function (res) {
                        expect(res).to.have.status(200);
                        console.log(res.body)
                        done();
                    });
                done();
            });
    });
});

