require('dotenv').config();

const supertest = require('supertest');
const app = require('./app');
describe('GET /', () => {

  it('should response with a message', async () => {
    const response = await supertest(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200);
  });

});

describe('POST /', () => {

  it('should response with a success message', async () => {
    const response = await supertest(app)
      .post('/')
      .send({
        username: 'john',
        firstName: 'john',
        lastName: 'john',
        email: 'john@app.com',
        phoneNumber: '0123123123',
        company: 'xxx',
        position: 'developer'
      })
      .set('Accept', 'application/json')
    
      .expect('Content-Type', /json/)
      .expect(200);
  });

});