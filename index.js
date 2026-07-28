const express = require('express')
const app = express()

const { PORT, SESSION_SECRET, NODE_ENV, SECRET } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/reading_list')

const errorHandler = require('./middleware/errorHandler')
const { authorization } = require('./middleware/authorization')

const { User, Blog, ReadingList, Session } = require('./models')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


app.use(express.json())


// Helpers
app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.post('/api/reset', async (req, res, next) => {
  try {
    await Blog.destroy({ truncate: true, cascade: true })
    await User.destroy({ truncate: true, cascade: true })
    await ReadingList.destroy({ truncate: true, cascade: true })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})


// Resources
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)


// Authentication
app.post('/api/login', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  if (!user) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  const passwordCorrect = await bcrypt.compare(
    body.password,
    user.passwordHash
  )

  const session = await Session.create({
    userId: user.id,
  })

  const userForToken = {
    username: user.username, 
    id: user.id,
    sessionId: session.id
  }

  const token = jwt.sign(userForToken, SECRET)

  res
    .status(200)
    .send({ token, username: user.username, name: user.name })
  })

app.delete('/api/logout', authorization, async (req, res) => {
  await req.sessionRecord.destroy()
  res.status(204).end()
});


// Error handler
app.use(errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()