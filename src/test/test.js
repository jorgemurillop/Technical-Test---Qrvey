'use strict'

// var assert = require('assert');
// const request = require('supertest');
// const app = require('../app');

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const config = require('./config');

chai.use(chaiHttp);

describe('Insert a user: ', () => {
    it('should insert a user', (done) => {
       
        chai.request(config.URL)
            .post('/api/signup')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({
                "email": "utestQrvey_1@gmail.com",
                "displayName": "unit test",
                "password": "XyZ123QWe_"
            })
            .end(function (err, res) {
                console.log(res.body);
                expect(res).to.have.status(201);
                done();
            });
    });
});



// var assert = require('assert');
// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });