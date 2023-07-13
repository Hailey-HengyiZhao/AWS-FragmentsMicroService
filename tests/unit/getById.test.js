// tests/getById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  const email = 'user1@email.com';
  const fragmentData = 'Expect to be the FragmentContent';

  test('Res fragment with correct credentials', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth(email, 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(fragmentData);
  });

  test('Res fragment with Text/markdown and set with extension .html', async () => {
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/markdown')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${fragmentId}.html`).auth(email, 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(`<p>${fragmentData}</p>\n`);
    expect(res.headers['content-type'].split(';')[0]).toEqual('text/html');
  });

  test('Res fragment with incorrect id', async () => {
    await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = 'incorrectId';

    const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth(email, 'password1');

    expect(res.statusCode).toBe(404);
  });
});
