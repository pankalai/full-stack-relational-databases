const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')


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