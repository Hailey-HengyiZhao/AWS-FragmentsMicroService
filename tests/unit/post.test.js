// tests/routes.test.js
const request = require('supertest');
const app = require('../../src/app'); 
const hash = require('../../src/hash');

describe('POST /v1/fragments', () => {

   const email = "user1@email.com";

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

  test('incorrect Content-Type are denied', async()=>{
    const fragmentData = "This is a sample fragment text.";

    const res = await request(app)
    .post('/v1/fragments')
    .set('Content-Type', 'text/html')
    .auth(email, 'password1') 
    .send(fragmentData);

    expect(res.statusCode).toBe(415);
  })

  test('Res fragment with correct Content-Type', async () => {
    const fragmentData = "This is a sample fragment text.";

    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1') 
      .send(fragmentData);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual(hash(email));
  });
});
