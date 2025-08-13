const request = require('supertest');
const express = require('express');
const router = require('../reports');
import { Project } from '../../models/Project';


describe('GET /results-with-issues', () => {
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

  it('should return the top 5 violations for a project', async () => {

    const response = await request(app).get(`/results-with-issues?projectId=${projectId}`);

    expect(response.status).toBe(200);
    const results = response.body;
    expect(results.length <= 5);
    results.forEach(item => {
      expect(item.impact === 'serious' || 'critical')
      expect(item.url).toBeDefined();
      expect(item.count).toBeGreaterThanOrEqual(1);
      expect(item.help).toBeDefined();
    });
  });

  it('should return the top 5 violations for a project with a minimum impact level', async () => {

    const response = await request(app).get(`/results-with-issues?projectId=${projectId}&impact=critical`);

    expect(response.status).toBe(200);
    const results = response.body;
    expect(results.length <= 5);
    results.forEach(item => {
      expect(item.impact === 'critical')
    });
  });
});
