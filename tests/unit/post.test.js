// tests/routes.test.js
const request = require('supertest');
const app = require('../../src/app'); 

describe('POST /v1/fragments', () => {
  test('unauthenticated requests are denied', async () => {
    const response = await request(app).post('/v1/fragments');
    expect(response.statusCode).toBe(401);
  });

  test('incorrect credentials are denied', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password');
    expect(response.statusCode).toBe(401);
  });

  test('creates a new fragment', async () => {
    const fragmentData = "This is a sample fragment text.";

    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1') 
      .send(fragmentData);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toEqual('user1@email.com');
  });
});
