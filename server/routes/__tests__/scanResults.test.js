import express from 'express';
import request from 'supertest';
import { Project } from '../../models/Project';
import router from '../scanResults';

describe('/api/scan-results', () => {
  let app;
  let projectId;
  beforeEach(async () => {
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

  it('should return 400 if the project ID is not found', async () => {
    const res = await request(app).get('/?projectId=687becca089a324aa2be8053');
    expect(res.statusCode).toEqual(400);
  });

  it('should return 404 for non-existent scan result', async () => {
    const res = await request(app).get('/non-existent-id');
    expect(res.statusCode).toEqual(404);
  });
});

