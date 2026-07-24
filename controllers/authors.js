const router = require('express').Router()

const { sequelize } = require('../util/db')
const { Blog } = require('../models')


router.get('/', async (req, res) => {
    const totalLikes = sequelize.fn('SUM', sequelize.col('likes'))

	const authorStats = await Blog.findAll({
		attributes: [
			'author',
			[sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
            [totalLikes, 'likes'],
		],
		group: ['author'],
        order: [
            [totalLikes, 'DESC']
        ]
  })

  res.json(authorStats)
})

module.exports = router