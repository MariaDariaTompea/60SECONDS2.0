const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class community_likes extends Model {}

  community_likes.init(
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
      entity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      entity_type: {
        type: DataTypes.ENUM('post', 'comment'),
        allowNull: false,
      },
      like_type: {
        type: DataTypes.ENUM('like', 'dislike'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'community_likes',
      tableName: 'community_likes',
      timestamps: false,
    }
  )

  return community_likes
}