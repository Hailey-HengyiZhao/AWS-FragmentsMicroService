// tests/putById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('PUT /v1/fragments/:id', () => {
  const email = 'user1@email.com';
  const fragmentData = 'Expect to be the FragmentContent';
  const fragmentData2 = 'New FragmentContent';

  test('Update fragment with correct credentials and matching Content-Type', async () => {
    // Create a fragment
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id

    // Update the fragment
    const resPut = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData2);

    expect(resPut.statusCode).toBe(200);
    
    const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth(email, 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(fragmentData2);

  });

  test('Fail to update fragment with non-matching Content-Type', async () => {
    // Create a fragment
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    // Try to update with wrong Content-Type
    const resPut = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .set('Content-Type', 'no/supportedType')
      .auth(email, 'password1')
      .send(fragmentData2);

    expect(resPut.statusCode).toBe(415);
  });

  test('Fail to update fragment with incorrect ID', async () => {
    const incorrectId = 'incorrectId';

    // Try to update non-existing fragment
    const resPut = await request(app)
      .put(`/v1/fragments/${incorrectId}`)
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData2);

    expect(resPut.statusCode).toBe(500);
  });
});
