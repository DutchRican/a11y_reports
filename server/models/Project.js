const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, default: '' },
	pageUrl: { type: String, default: '' },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
	isActive: { type: Boolean, default: true },
	deletedAt: { type: Date, default: null },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = { Project };