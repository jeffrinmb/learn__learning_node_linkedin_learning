/* eslint-disable no-undef */
const request = require('request');

describe('calc', () => {
  it('Should Multiply 2 and 2', () => {
    expect(2 * 2).toBe(4);
  });
});

describe('get messages', () => {
  it('Should Return 200 OK', (done) => {
    request.get('http://localhost:3000/messages', (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });
  it('Should Return Non Empty List', (done) => {
    request.get('http://localhost:3000/messages', (err, res) => {
      expect(JSON.parse(res.body).length).toBeGreaterThan(0);
      done();
    });
  });
});

describe('get user specific messages', () => {
  it('Should Return 200 OK', (done) => {
    request.get('http://localhost:3000/messages/Jeff', (err, res) => {
      expect(res.statusCode).toEqual(200);
      done();
    });
  });
  it('Name Should Be Jeff', (done) => {
    request.get('http://localhost:3000/messages/Jeff', (err, res) => {
      expect(JSON.parse(res.body)[0].name).toEqual('Jeff');
      done();
    });
  });
});
