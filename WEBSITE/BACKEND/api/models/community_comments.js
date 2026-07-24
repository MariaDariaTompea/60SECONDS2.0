const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class community_comments extends Model {}

  community_comments.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        parent_comment_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        content: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        gotEdit: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
      sequelize,
      modelName: 'community_comments',
      tableName: 'community_comments',
      timestamps: true,
    }
  )

  return community_comments
}