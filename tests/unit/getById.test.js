const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  const email = 'user1@email.com';
  const password = 'password1';
  const fragmentData = 'Expect to be the FragmentContent';

  // Utility function to create a fragment
  async function createFragment(contentType, data) {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', contentType)
      .auth(email, password)
      .send(data);
    return res.body.fragment.id;
  }

  test('Res fragment with correct credentials', async () => {
    const fragmentId = await createFragment('text/plain', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(fragmentData);
  });

  test('Res fragment with Text/markdown and set with extension .html', async () => {
    const fragmentId = await createFragment('text/markdown', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.html`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(`<p>${fragmentData}</p>\n`);
    expect(res.headers['content-type'].split(';')[0]).toEqual('text/html');
  });

  test('Res fragment with Text/plain and set with extension .txt', async () => {
    const fragmentId = await createFragment('text/plain', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.txt`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(fragmentData);
    expect(res.headers['content-type'].split(';')[0]).toEqual('text/plain');
  });
  
  test('Cannot convert text/plain to .md', async () => {
    const fragmentId = await createFragment('text/plain', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.md`).auth(email, password);
    
    expect(res.statusCode).toBe(415);
  });
  
  test('Res fragment with incorrect id', async () => {
    const fragmentId = 'incorrectId';
    const res = await request(app).get(`/v1/fragments/${fragmentId}`).auth(email, password);
    expect(res.statusCode).toBe(404);
  });

});
