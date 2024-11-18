const request = require('supertest');
const app = require('../test/app'); // Adjust the path as needed

describe('Rate Limiting Tests', () => {
  it('should pass if under rate limit', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app).get('/Test');
  }
    
    const res = await request(app).get('/Test').expect(200);
    expect(res.status).toBe(200);
});

  it('should return 429 if rate limit is exceeded', async () => {

    const res = await request(app).get('/Test');
    expect(res.status).toBe(429);
    expect(res.body.error).toBe('Too many requests, please try again later');
    expect(res.header['retry-after']).toBeDefined();
});



});
