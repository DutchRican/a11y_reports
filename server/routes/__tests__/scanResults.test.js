import express from 'express';
import request from 'supertest';
import { Project } from '../../models/Project';
import { ScanResult } from '../../models/ScanResult';
import router from '../scanResults';

describe('/api/scan-results', () => {
  let app;
  let projectId;
  let originalEnv = process.env;


  beforeEach(async () => {
    jest.resetModules();
    process.env = { ...originalEnv };
    app = express();
    app.use(router);
    const project = await Project.findOne();
    projectId = project._id;
  });
  it('should return all scan results', async () => {
    const res = await request(app).get('/?projectId=' + projectId);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should return a scan result by ID', async () => {
    const prepCall = await request(app).get('/?projectId=' + projectId);
    const id = prepCall.body[0]._id;
    const res = await request(app).get(`/${id}?projectId=` + projectId);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('violations');
  });

  it('should return 404 if the project ID is not found', async () => {
    const res = await request(app).get('/?projectId=687becca089a324aa2be8053');
    expect(res.statusCode).toEqual(404);
  });

  it('should return 400 when missing the projectId', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(400);
  });

  it('should return 404 for non-existent scan result', async () => {
    const res = await request(app).get('/non-existent-id');
    expect(res.statusCode).toEqual(404);
  });

  it('can delete a scan result', async () => {
    process.env.ADMIN_KEY = 'test-key';
    const scan = await ScanResult.create({
      projectId: '6884fea2f5a23601459d2290',
      testName: 'Test Scan',
      url: 'http://example.com',
      created: new Date(),
      violations: []
    });

    const res = await request(app).delete(`/${scan._id}`).set("authorization", "test-key");
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Scan result deleted successfully');
  });

  it('throws an error without the admin key for delete', async () => {
    const res = await request(app).delete('/asdfadsf');
    expect(res.statusCode).toEqual(401);
  });

  it('throws an error for the wrong admin key for delete', async () => {
    const res = await request(app).delete('/asdfasdfasdf').set("authorization", "test-key");
    expect(res.statusCode).toEqual(403);
  });
});

