const express = require('express');
const Project = require('../models/Project');
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

/* Create a new project
 * @param {Object} project - The project data to create
 * @returns {Object} - The created project
 * @throws {Error} - If there is an issue creating the project
 * Example: POST /projects
 */
router.post('/', upload.none(), async (req, res) => {
	const { name, description, pageUrl } = req.body;
	if (!name) {
		return res.status(400).json({ message: 'Project name is required' });
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

module.exports = router;