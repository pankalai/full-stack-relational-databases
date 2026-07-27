const router = require('express').Router()

const { ReadingList, User } = require('../models')

const { userExtractor } = require('../middleware/userExtractor')
const { blogFinder } = require('../middleware/blogFinder')


router.post('/', userExtractor, blogFinder(req => req.body.blogId), async (req, res, next) => {
	if (req.user.id !== req.body.userId) {
		const error = new Error('Cannot create a reading list entry for another user')
		error.status = 403
		return next(error)
	}
	try {
		const reading_list = await ReadingList.create({...req.body, read: false})
		res.json(reading_list)
	} catch(error) {
		console.log(error)
		next(error)
	}
})

router.put('/:id', userExtractor, async (req, res, next) => {
	try {
		const reading_list = await ReadingList.findByPk(req.params.id)

		if (!reading_list) {
			const error = new Error('Reading list not found')
			error.status = 404
			return next(error)
		}

		if (req.user.id !== reading_list.userId) {
			const error = new Error('Not authorized to modify this reading list entry')
			error.status = 403
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