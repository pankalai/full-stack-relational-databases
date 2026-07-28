const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

const authorization = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (
    !authorization ||
    !authorization.toLowerCase().startsWith('bearer ')
  ) {
    return res.status(401).json({
      error: 'token required'
    })
  }
  
  try {

    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    const session = await Session.findOne({
      where: {
        id: decodedToken.sessionId,
        userId: decodedToken.id
      }
    })

    const expired =
      session?.expiresAt &&
      session.expiresAt < new Date()

    if (!session || expired) {
      return res.status(401).json({
        error: 'session expired'
      })
    }

    const user = await User.findByPk(decodedToken.id)

    if (!user) {
      return res.status(401).json({ error: 'user not found' })
    }

    req.decodedToken = decodedToken
    req.sessionRecord = session
    req.user = user

  } catch (error) {
    return res.status(401).json({ error: 'token invalid' })
  }

  next()
}


module.exports = { authorization }