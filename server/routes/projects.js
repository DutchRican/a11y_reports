const express = require('express');
const { Project } = require('../models/Project');
const router = express.Router();
const upload = require('multer')();

router.get('/', async (_req, res) => {
	try {
		const projects = await Project.find().select({ _id: 1, name: 1, description: 1, createdAt: 1 }).where({ isActive: true }).sort({ createdAt: -1 });
		res.json(projects);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

/* Create a new project (expects formData)
 * @param {Object} formData - The project data to create (multipart/form-data)
 * @returns {Object} - The created project
 * @throws {Error} - If there is an issue creating the project
 * Example: POST /projects (Content-Type: multipart/form-data)
 */
router.post('/', upload.none(), async (req, res) => {
	const { name, description, pageUrl } = req.body;
	if (!name) {
		return res.status(400).json({ message: 'Project name is required' });
	}
	const existingProject = await Project.findOne({ name });
	if (existingProject) {
		return res.status(400).json({ message: 'Project with this name already exists' });
	}
	try {
		const date = new Date();
		const project = new Project({ name, description, createdAt: date, updatedAt: date, pageUrl });
		const savedProject = await project.save();
		res.status(201).json(savedProject);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

/* Update an existing project
 * @param {string} id - The ID of the project to update
 * @param {Object} project - The updated project data
 * @returns {Object} - The updated project
 * @throws {Error} - If there is an issue updating the project
 * Example: PUT /projects/:id
 */
router.put('/:id', upload.none(), async (req, res) => {
	const { name, description, pageUrl } = req.body;
	if (!name) {
		return res.status(400).json({ message: 'Project name is required' });
	}
	try {
		const project = await Project.findById(req.params.id);
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		project.name = name;
		project.description = description;
		project.pageUrl = pageUrl;
		project.updatedAt = new Date();
		const updatedProject = await project.save();
		res.json(updatedProject);
	} catch (err) {
		if (err instanceof Error.CastError) {
			return res.status(404).json({ message: 'Invalid ID' });
		}
		res.status(500).json({ message: err.message });
	}
});

/* Soft delete a project
 * @param {string} id - The ID of the project to delete
 * @returns {Object} - The updated project with deletedAt timestamp
 * @throws {Error} - If there is an issue deleting the project
 * Example: DELETE /projects/:id
 */
router.delete('/:id', async (req, res) => {
	try {
		const project = await Project.findById(req.params.id);
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		project.isActive = false;
		project.deletedAt = new Date();
		const updatedProject = await project.save();
		res.json(updatedProject);
	} catch (err) {
		if (err instanceof Error.CastError) {
			return res.status(404).json({ message: 'Invalid ID' });
		}
		res.status(500).json({ message: err.message });
	}
});

/* Admin hard delete a project
 * @param {string} id - The ID of the project to hard delete
 * @returns {Object} - The deleted project
 * @throws {Error} - If there is an issue hard deleting the project
 * Example: DELETE /projects/:id/hard-delete
 */
router.delete('/:id/hard-delete', async (req, res) => {
	try {
		const project = await Project.findByIdAndDelete(req.params.id);
		if (!project) {
			return res.status(404).json({ message: 'Project not found' });
		}
		res.json({ message: 'Project deleted successfully', project });
	} catch (err) {
		if (err instanceof Error.CastError) {
			return res.status(404).json({ message: 'Invalid ID' });
		}
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;