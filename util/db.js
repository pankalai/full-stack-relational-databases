const Sequelize = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = require('./config')

const db_url = 
  TESTING && TEST_DATABASE_URL 
    ? TEST_DATABASE_URL 
    : DATABASE_URL

const sequelize = new Sequelize(db_url, {
  // dialectOptions: {
  //   ssl: {
	// 		require: true,
	// 		rejectUnauthorized: false
  //   }
	// },
	dialect: 'postgres',
})

const migrationConf = {
  migrations: {
    glob: 'migrations/[0-9]*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database', db_url)
  } catch (err) {
    console.log('failed to connect to the database', db_url)
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }