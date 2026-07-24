const { Model, Sequelize } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class community_posts extends Model {}

  community_posts.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        content: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        pinned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        gotEdit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
      sequelize,
      modelName: 'community_posts',
      tableName: 'community_posts',
      timestamps: true,
    }
  )

  return community_posts
}