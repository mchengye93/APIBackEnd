const assert = require('assert');

const request = require('request');

/* Test for invalid parameters */


/* Test for invalid tags */
describe('Testing tags parameters', () => {
  it('Testing valid tag', (done) => {
    request('http://localhost:3000/api/posts?tags=tech&sortBy=likes&direction=desc', (err, response, body) => {
      assert.equal(200, response.statusCode);
      done();
    });
  });

  it('Testing multiple valid tag', (done) => {
    request('http://localhost:3000/api/posts?tags=tech,science,history&sortBy=likes&direction=desc', (err, response, body) => {
      assert.equal(200, response.statusCode);
      done();
    });
  });

  it('Test an invalid tags', (done) => {
    request('http://localhost:3000/api/posts?tags=tec&sortBy=likes&direction=desc', (err, response, body) => {
      const error = { error: 'Tags parameter is not valid' };
      assert.equal(400, response.statusCode);
      assert.deepEqual(body, JSON.stringify(error));
      done();
    });
  });

  it('Test multiple invalid tags', (done) => {
    request('http://localhost:3000/api/posts?tags=tech,histry,scn&sortBy=likes&direction=desc', (err, response, body) => {
      const error = { error: 'Tags parameter is not valid' };
      assert.equal(400, response.statusCode);
      assert.deepEqual(body, JSON.stringify(error));
      done();
    });
  });
});

/* Test for invalid sortBy */
describe('Testing sortBy parameter', () => {
  it('Testing valid sortBy parameter', (done) => {
    request('http://localhost:3000/api/posts?tags=tech&sortBy=likes&direction=desc', (err, response, body) => {
      assert.equal(200, response.statusCode);
      done();
    });
  });
  it('Test an invalid sortBy parameter', (done) => {
    request('http://localhost:3000/api/posts?tags=tech&sortBy=liks&direction=desc', (err, response, body) => {
      const error = { error: 'sortBy parameter is invalid' };
      assert.equal(400, response.statusCode);
      assert.deepEqual(body, JSON.stringify(error));
      done();
    });
  });
});
/* Test direction parameter */

describe('Testing direction parameter', () => {
  it('Testing valid sortBy parameter', (done) => {
    request('http://localhost:3000/api/posts?tags=tech&sortBy=likes&direction=desc', (err, response, body) => {
      assert.equal(200, response.statusCode);
      done();
    });
  });

  it('Test an invalid sortBy parameter', (done) => {
    request('http://localhost:3000/api/posts?tags=tech&sortBy=likes&direction=ascd', (err, response, body) => {
      const error = { error: 'direction parameter is invalid' };
      assert.equal(400, response.statusCode);
      assert.deepEqual(body, JSON.stringify(error));
      done();
    });
  });
});
