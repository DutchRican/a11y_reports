import express from 'express';
import request from 'supertest';
import router from '../scanResults';

describe('GET /api/scan-results', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(router);
  });
  it('should return all scan results', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should return a scan result by ID', async () => {
    const prepCall = await request(app).get('/');
    const id = prepCall.body[0]._id;
    const res = await request(app).get(`/${id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('violations');
  });

  it('should return 404 for non-existent scan result', async () => {
    const res = await request(app).get('/non-existent-id');
    expect(res.statusCode).toEqual(404);
  });
});

