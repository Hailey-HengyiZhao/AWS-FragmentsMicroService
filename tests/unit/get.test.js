// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  const email = 'user1@email.com';
  const fragmentData = 'Testing FragmentContent';

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password and return success result
  test('authenticated users GET /v1/fragments', async () => {
    const res = await request(app).get('/v1/fragments').auth(email, 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // testing the /v1/fragments information after post request
  test('authenticate user GET /v1/fragments after POST request', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    const res = await request(app).get(`/v1/fragments`).auth(email, 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.fragments[0]).toEqual(fragmentId); // replace with the expected data
  });
  
  // testing /v1/fragment?expand=1
  test('authenticated users GET /v1/fragment?expand=1', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    const res = await request(app).get('/v1/fragments?expand=1').auth(email, 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments[0].ownerId).toEqual(hash(email));
    expect(res.body.fragments[1].id).toEqual(fragmentId);
  });

  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));
});
