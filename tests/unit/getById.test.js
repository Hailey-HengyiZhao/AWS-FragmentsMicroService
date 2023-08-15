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

  // More tests for different types and conversions

  test('Res fragment with Text/plain and set with extension .txt', async () => {
    const fragmentId = await createFragment('text/plain', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.txt`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual(fragmentData);
    expect(res.headers['content-type'].split(';')[0]).toEqual('text/plain');
  });

  // Test for markdown to text conversion
  test('Res fragment with Text/markdown and set with extension .txt', async () => {
    const fragmentId = await createFragment('text/markdown', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.txt`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type'].split(';')[0]).toEqual('text/plain');
  });

  // Test for markdown to text conversion
  test('Res fragment with Text/html and set with extension .txt', async () => {
    const fragmentId = await createFragment('text/html', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.txt`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type'].split(';')[0]).toEqual('text/plain');
  });
  
  // Test for text/plain to json
  test('Res fragment with text/plain and set with extension .json', async () => {
    const fragmentId = await createFragment('text/plain', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.json`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type'].split(';')[0]).toEqual('application/json');
  });

  // Test for image/jpeg to image/png
  test('Res fragment with image/jpeg and set with extension .png', async () => {
    const fragmentId = await createFragment('image/jpeg', fragmentData);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.png`).auth(email, password);
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type'].split(';')[0]).toEqual('image/png');
  });

  // Fail to Converting
  test('Res fragment fail to convert text/plain and set with extension .md', async () => {
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
