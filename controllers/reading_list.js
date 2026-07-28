const router = require('express').Router()

const { ReadingList, User } = require('../models')

const { authorization } = require('../middleware/authorization')
const { blogFinder } = require('../middleware/blogFinder')


router.post('/', blogFinder(req => req.body.blogId), async (req, res, next) => {
	try {
		if (!req.body.userId){
			const error = new Error('userId is missing')
			error.status = 400
			return next(error)
		}

		const user = await User.findByPk(req.body.userId)

		if (!user) {
			const error = new Error('User not found')
			error.status = 404
			return next(error)
		}

		const reading_list = await ReadingList.create({...req.body, read: false})
		res.json({
			id: reading_list.id,
			user_id: reading_list.userId,
			blog_id: reading_list.blogId,
			read: reading_list.read
		})
	} catch(error) {
		console.log(error)
		next(error)
	}
})

router.put('/:id', authorization, async (req, res, next) => {
	try {
		const reading_list = await ReadingList.findByPk(req.params.id)

		if (!reading_list) {
			const error = new Error('Reading list not found')
			error.status = 404
			return next(error)
		}

		if (req.user.id !== reading_list.userId) {
			const error = new Error('Not authorized to modify this reading list entry')
			error.status = 401
			return next(error)
		}

		reading_list.read = req.body.read
		await reading_list.save()
		
		res.json(reading_list)
	} catch(error) {
		next(error)
	}
})


module.exports = router