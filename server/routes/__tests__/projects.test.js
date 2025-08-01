import express from 'express';
import request from 'supertest';
import { Project } from '../../models/Project';
import router from '../projects';

describe('/api/projects', () => {
	let app;
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...originalEnv };
		app = express();
		app.use(express.json());
		app.use(router);
	});

	it('should create a new project', async () => {
		const res = await request(app)
			.post('/')
			.field('name', 'Test Project')
			.field('description', 'Test Description')
			.field('pageUrl', 'http://example.com');
		expect(res.statusCode).toEqual(201);
		expect(res.body).toHaveProperty('_id');
		expect(res.body.name).toEqual('Test Project');
		expect(res.body.description).toEqual('Test Description');
		expect(res.body.pageUrl).toEqual('http://example.com');
	});

	it('should update a project', async () => {
		const project = await Project.create({
			name: 'Test Project',
			description: 'Test Description',
			pageUrl: 'http://example.com',
		});

		const res = await request(app)
			.put(`/${project._id}`)
			.field('name', 'Updated Project')
			.field('description', 'Updated Description')
			.field('pageUrl', 'http://updated-example.com');

		expect(res.statusCode).toEqual(200);
		expect(res.body.name).toEqual('Updated Project');
		expect(res.body.description).toEqual('Updated Description');
		expect(res.body.pageUrl).toEqual('http://updated-example.com');
	});

	it('should return 404 for non-existent project', async () => {
		const res = await request(app)
			.put('/60d5f484f1b2c8b8f8e4e4e4')
			.send({
				name: 'Non-existent Project',
				description: 'This project does not exist',
				pageUrl: 'http://non-existent.com',
			});

		expect(res.statusCode).toEqual(404);
		expect(res.body.message).toEqual('Project not found');
	});

	it('can delete a project', async () => {
		process.env.ADMIN_KEY = 'test-key';
		const project = await Project.create({
			name: 'Test Project',
			description: 'Test Description',
			pageUrl: 'http://example.com',
		});

		const res = await request(app).delete(`/${project._id}`).set("authorization", "test-key");
		expect(res.statusCode).toEqual(200);
		expect(res.body.isActive).toEqual(false);
	});

	it('throws an error without the admin key', async () => {

		const res = await request(app).delete('/asdfasdfasfd')
		expect(res.statusCode).toEqual(401);
	});

	it('throws an error for the wrong admin key', async () => {

		const res = await request(app).delete('/asdfasdfasdf').set("authorization", "test-key");
		expect(res.statusCode).toEqual(403);
	});

	it('can hard delete a project', async () => {
		process.env.ADMIN_KEY = 'test-key';
		const project = await Project.create({
			name: 'Test Project',
			description: 'Test Description',
			pageUrl: 'http://example.com',
		});

		const res = await request(app).delete(`/${project._id}/hard-delete`).set("authorization", "test-key");
		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual('Project deleted successfully');
	});

	it('throws an error without the admin key for hard delete', async () => {
		const res = await request(app).delete(`/asdfadsf/hard-delete`);
		expect(res.statusCode).toEqual(401);
	});

	it('throws an error for the wrong admin key for hard delete', async () => {
		const res = await request(app).delete('/asdfasdfasdf/hard-delete').set("authorization", "test-key");
		expect(res.statusCode).toEqual(403);
	});
});