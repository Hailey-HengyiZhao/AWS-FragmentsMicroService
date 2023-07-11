// tests/getById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  
  const email = 'user1@email.com';
  const fragmentData = 'Expect to be the FragmentContent';
  const contentType = 'text/plain';

  test('Res fragment with correct credentials', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', contentType)
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}/info`).auth(email, 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.fragment.id).toEqual(fragmentId);
    expect(res.body.fragment.type).toEqual(contentType);
  });

  test('Res fragment with incorrect id', async () => {
    await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = 'incorrectId';

    const res = await request(app).get(`/v1/fragments/${fragmentId}/info`).auth(email, 'password1');

    expect(res.statusCode).toBe(404);
  });
});
