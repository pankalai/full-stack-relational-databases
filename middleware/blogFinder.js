const { Blog } = require('../models')


const blogFinder = (getBlogId) => async (req, res, next) => {
	try {
		if (!getBlogId(req)) {
			const error = new Error('blogId is missing')
			error.status = 400
			return next(error)
		}

		const blog = await Blog.findByPk(getBlogId(req))

		if (!blog) {
			const error = new Error('Blog not found')
			error.status = 404
			return next(error)
		}
		req.blog = blog
		return next()
	} catch (error) {
		next(error)
	}
}

module.exports = { blogFinder }