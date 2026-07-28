const errorHandler = (err, req, res, next) => {
	if (err.name === 'SequelizeDatabaseError') {
		return res.status(400).send({ error: 'Malformatted data' })
	}

	if (err.name === 'SequelizeValidationError') {
		return res.status(400).json({ error: err.errors.map(e => e.message) })
	}

	if (err.name === 'SequelizeUniqueConstraintError') {
		return res.status(400).json({ error: 'Data already exists' })
	}

	if (err.status) {
		return res.status(err.status).json({
			error: err.message
		})
	}

	next(err)
}

module.exports = errorHandler