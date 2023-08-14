// tests/deleteById.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /v1/fragments/:id', () => {
  const email = 'user1@email.com';
  const fragmentData = 'This fragment will be deleted';

  test('Delete fragment with correct credentials', async () => {
    // First, post a new fragment
    const resPost = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .auth(email, 'password1')
      .send(fragmentData);

    const fragmentId = resPost.body.fragment.id;

    // Try deleting the fragment
    const resDelete = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth(email, 'password1');

    expect(resDelete.statusCode).toBe(200);
    expect(resDelete.body).toEqual({ status: "ok" });

    // Check if the fragment is really deleted
    const resGet = await request(app)
      .get(`/v1/fragments/${fragmentId}`)
      .auth(email, 'password1');

    expect(resGet.statusCode).toBe(404);
  });

  test('Delete fragment with incorrect id', async () => {
    // Using an incorrect fragmentId for deletion
    const fragmentId = 'incorrectId';

    const resDelete = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth(email, 'password1');

    expect(resDelete.statusCode).toBe(404);
  });

  test('Delete fragment with incorrect id', async () => {
    // Using an incorrect fragmentId for deletion
    const fragmentId = 'incorrectId';

    const resDelete = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth(email, 'password1');

    expect(resDelete.statusCode).toBe(404);
  });
});
