const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/reading_list')

const errorHandler = require('./middleware/errorHandler')

const { User, Blog } = require('./models')


app.use(express.json())

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.post('/api/reset', async (req, res, next) => {
  try {
    await Blog.destroy({ truncate: true, cascade: true })
    await User.destroy({ truncate: true, cascade: true })

    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)

app.use(errorHandler)


const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()