const { Project } = require('../models/Project.js');

const projectCheck = async (req, res, next) => {
	const projectId = req.query.projectId;
	if (!projectId) {
		return res.status(400).json({ message: 'Project ID is required' });
	}
	try {
		const project = await Project.findById(projectId);
		if (!project) {
			return res.status(404).json({ message: 'Project not found for ID ' + projectId });
		}
		req.project_id = project._id;
	} catch (err) {
		if (err.name === 'CastError') {
			return res.status(400).json({ message: 'Invalid Project ID format' });
		} else {
			return res.status(500).json({ message: 'Error retrieving project:', error: err });
		}
	}
	next();
};


module.exports = { projectCheck };