// getByIdPic.text.js
const request = require('supertest');
const app = require('../../src/app');

const fs = require('fs');

describe('GET /v1/fragments/:id', () => {
  const email = 'user1@email.com';
  const password = 'password1';

  // Utility function to create a fragment
  async function createFragment(contentType, data) {
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', contentType)
      .auth(email, password)
      .send(data);
    return res.body.fragment.id;
  }

  // Sample jpeg image for testing
  const sampleJpgImage = fs.readFileSync('./tests/site-logo-1.jpg');
  const samplePngImage = fs.readFileSync('./tests/site-logo-1.png');

  // Test for image/png to image/jpeg
  test('Res fragment with image/png and set with extension .jpg', async () => {
    const fragmentId = await createFragment('image/png', samplePngImage);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.jpg`).auth(email, password);
    expect(res.statusCode).toBe(200);

    // Check that the response is indeed in PNG format
    expect(res.headers['content-type'].split(';')[0]).toEqual('image/jpeg');
  }, 20000);

  // Test for image/jpeg to image/png
  test('Res fragment with image/jpeg and set with extension .png', async () => {
    const fragmentId = await createFragment('image/png', sampleJpgImage);
    const res = await request(app).get(`/v1/fragments/${fragmentId}.png`).auth(email, password);
    expect(res.statusCode).toBe(200);

    // Check that the response is indeed in PNG format
    expect(res.headers['content-type'].split(';')[0]).toEqual('image/png');
  }, 20000);
});

