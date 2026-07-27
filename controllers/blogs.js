const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Op } = require('sequelize')

const { Blog, User } = require('../models')

const { userExtractor } = require('../middleware/userExtractor')
const { blogFinder } = require('../middleware/blogFinder')


router.get('/', async (req, res) => {
	const where = {}

	if (req.query.search) {
		where[Op.or] = [
			{
				title: {
					[Op.substring]: req.query.search
				}
			},
			{
				author: {
					[Op.substring]: req.query.search
				}
			}
		]
	}

  const blogs = await Blog.findAll({
		attributes: {
			exclude: ['UserId']
		},
		include: {
			model: User,
			attributes: ['name']
		},
		where,
		order: [
			['likes', 'DESC']
		]
  })

  res.json(blogs)
})

router.post('/', userExtractor, async (req, res, next) => {
	try {
		const blog = await Blog.create({...req.body, userId: req.user.id})
		res.json(blog)
	} catch(error) {
		console.log(error)
		next(error)
	}
})

router.put('/:id', blogFinder(req => req.params.id), async (req, res, next) => {
	try {
		if (!Number.isInteger(req.body?.likes)) {
			const error = new Error("Missing or invalid 'likes' value")
			error.status = 400
			return next(error)
		}
		req.blog.likes = req.body.likes
  	await req.blog.save()
  	res.json(req.blog)
	} catch(error) {
		next(error)
	}
})

router.delete('/:id', userExtractor, blogFinder(req => req.params.id), async (req, res, next) => {
	if (req.blog.UserId !== req.user.id) {
			const error = new Error("Not allowed to delete")
			error.status = 401
			return next(error)
	}
	await req.blog.destroy()
	return res.status(204).end()
})


module.exports = router