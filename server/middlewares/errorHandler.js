const mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
function handleError(err, _req, res, _next) {
	if (err instanceof mongoose.Error.ValidationError) {
		return res.status(400).json({ message: "Validation error" });
	} else if (err instanceof mongoose.Error.CastError) {
		return res.status(400).json({ message: 'Invalid ID' });
	} else if (err instanceof mongoose.Error.DocumentNotFoundError) {
		return res.status(404).json({ message: 'Not found' });
	}

	// Default to 500 Internal Server Error for any unhandled errors
	return res.status(500).json({ message: 'Internal server error' });
}
module.exports = { handleError };
