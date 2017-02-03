const expect = require('chai').expect;
const should = require('chai').should;
const request = require('supertest');
const app = require('../server/server.js');

/* --> commented out: see error below */
// const getOptionsOnClick = require('../public/js/home.js')
// const getParameterByName = require('../public/js/poll.js')

/* --> Server/Route tests <-- */

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

/* --> Unit Tests <-- */

describe('Home.js Unit Tests', function() {
  // ERROR: $ is not defined in client-side code
  xit('getOptionsOnClick should be function', function() {
    expect(getOptionsOnClick).to.be.a('function')
  });
});

describe('Poll.js Unit Tests', function() {
  // ERROR: io is not defined in client-side code
  xit('should return the correct parameter', function() {
    const result = getURLParam('id', 'http://localhost:1111/?id=1')
    result.should.be.equal('1')
    done()
  });

  xit('should return the correct parameter', function() {
    // ERROR: io is not defined in client-side code
    const result = getURLParam('id', 'http://localhost:1111/?id=15')
    result.should.be.equal('15')
    done()
  });

  xit('should return the correct parameter', function() {
    // ERROR: io is not defined in client-side code
    const result = getURLParam('id', 'http://localhost:1111/?id=4')
    result.should.be.equal('4')
    done()
  });

  xit('should return the correct parameter', function() {
    // ERROR: io is not defined in client-side code
    const result = getURLParam('id', 'http://localhost:1111/?id=4')
    result.should.be.equal('string')
    done()
  });
});
