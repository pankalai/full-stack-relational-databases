const router = require('express').Router()
const bcrypt = require('bcrypt')

const { userExtractor } = require('../middleware/userExtractor')
const { User, Blog, ReadingList } = require('../models')


router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['UserId']
      }
    }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let where = {};

  if (req.query.read) {
    where = { read: req.query.read}
  }

  const user = await User.findByPk(req.params.id, {
    attributes: ['name','username'],
    include:[
      {
        model: Blog,
        as: 'readings',
        attributes: { 
          exclude: ['userId', 'createdAt', 'updatedAt']
        },
        through: {
          attributes: ['read', 'id'],
          where
        },
      },
    ]
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { password, ...rest } = req.body

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await User.create({
      ...rest,
      passwordHash
    })

    res.json(user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username : req.params.username } })
  
  if (!user) {
    res.status(404).end()
  }

  user.name = req.body.name
  await user.save()
  res.json(user)
})


module.exports = router