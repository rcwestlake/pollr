const expect = require('chai').expect;
const request = require('supertest');

const app = require('../server/server.js');

describe('GET routes', () => {
  it('/ - responds with success', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  })

  it('/authkeys - responds with success', function(done) {
    request(app)
      .get('/authkeys')
      .expect(200, done)
  })

  it('/api/polls - responds with success', function(done) {
    request(app)
      .get('/api/polls')
      .expect(200, done)
  })

  it('/api/polls/:id - responds with success', function(done) {
    request(app)
      .get('/api/polls/:id')
      .expect(200, done)
  })

  it('/polls/* - responds with success', function(done) {
    request(app)
      .get('/polls/*')
      .expect(200, done)
  })

  it('/api/options - responds with success', function(done) {
    request(app)
      .get('/api/options')
      .expect(200, done)
  })

  it('/api/options/:id - responds with success', function(done) {
    request(app)
      .get('/api/options/:id')
      .expect(200, done)
  })

  it('/api/votes - responds with success', function(done) {
    request(app)
      .get('/api/votes')
      .expect(200, done)
  })
});

describe('POST routes', () => {
  it('/api/polls - responds with success', function(done) {
    request(app)
      .post('/api/polls')
      .expect(200, done)
  })

  it('/api/options - responds with success', function(done) {
    request(app)
      .post('/api/options')
      .send({
        id: 1,
        options: ['opt1', 'opt2']
      })
      .expect(200, done)
  })
});

describe('undefined routes', () => {
  it('respond with a 404', function(done) {
    request(app)
      .get('/not-real')
      .expect(404, done);
  })
  it('respond with a 404', function(done) {
    request(app)
      .get('/103-another-fake')
      .expect(404, done);
  })
});
