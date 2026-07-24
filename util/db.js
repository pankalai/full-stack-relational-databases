const Sequelize = require('sequelize')
const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = require('./config')

const db_url = TESTING ? TEST_DATABASE_URL : DATABASE_URL

const sequelize = new Sequelize(db_url, {
  dialectOptions: {
    ssl: {
			require: true,
			rejectUnauthorized: false
    }
	},
	//dialect: 'postgres',
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database', db_url)
  } catch (err) {
    console.log('failed to connect to the database', db_url)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }