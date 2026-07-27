const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User } = require('../models')

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


module.exports = { userExtractor }