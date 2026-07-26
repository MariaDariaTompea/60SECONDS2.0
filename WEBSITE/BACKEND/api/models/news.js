const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class News extends Model {};

    News.init
    (
        {
            id:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            title:
            {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            excerpt:
            {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content:
            {
                type: DataTypes.JSON,
                allowNull: false,
            }
        },

        {
            sequelize,
            modelName: "News",
            timestamps: true,
        }
    )

    return News;
}