require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
  TESTING: process.env.TESTING || 'false' === 'true',
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development'
}