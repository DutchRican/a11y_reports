

const secureRoute = async (req, res, next) => {
	const auth = req.headers.authorization;
	if (!auth) {
		return res.status(401).json({ message: 'Unauthorized' });
	} else if (auth !== process.env.ADMIN_KEY) {
		return res.status(403).json({ message: 'Forbidden, bad admin key' });
	}
	next();
};

module.exports = { secureRoute };
