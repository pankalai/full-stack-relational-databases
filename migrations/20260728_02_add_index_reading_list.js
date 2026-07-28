const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addIndex(
      'reading_lists',
      ['user_id', 'blog_id'],
      {
        unique: true,
        name: 'reading_lists_user_blog_unique'
      }
    )
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeIndex(
      'reading_lists',
      'reading_lists_user_blog_unique'
    )
  }
}