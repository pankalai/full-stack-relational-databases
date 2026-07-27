const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      validYear(value) {
        const currentYear = new Date().getFullYear()

        if (value < 1991 || value > currentYear) {
          throw new Error(
            `Year must be between 1991 and ${currentYear}`
          )
        }
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'blog'
})

module.exports = Blog