const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')


const blogFinder = async (req, res, next) => {
  try {
		const blog = await Blog.findByPk(req.params.id)
    
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

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const decodedToken = jwt.verify(authorization.substring(7), SECRET)

			const user = await User.findByPk(decodedToken.id)

			if (!user) {
				return res.status(401).json({ error: 'user not found' })
			}

			req.user = user
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

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
	const blog = await Blog.create({...req.body, UserId: req.user.id})
	res.json(blog)
})

router.put('/:id', blogFinder, async (req, res, next) => {
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

router.delete('/:id', userExtractor, blogFinder, async (req, res, next) => {
	if (req.blog.UserId !== req.user.id) {
			const error = new Error("Not allowed to delete")
			error.status = 401
			return next(error)
	}
	await req.blog.destroy()
	return res.status(204).end()
})


module.exports = router