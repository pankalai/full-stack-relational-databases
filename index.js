const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')

app.use(express.json())

app.use('/api/blogs', blogsRouter)


// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     const blogs = await sequelize.query("SELECT * FROM blogs", { type: Sequelize.QueryTypes.SELECT })    
//     console.log("=================")
//     console.log("Printing blogs..")
//     for (const blog of blogs) {
//       console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
//     }
//     console.log("=================")
//     //sequelize.close()  
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// main()

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()