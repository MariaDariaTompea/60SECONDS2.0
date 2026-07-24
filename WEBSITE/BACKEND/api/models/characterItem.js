const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class characterItem extends Model {};

    characterItem.init
    (
        {
            id:
            {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            name:
            {
                type: DataTypes.STRING(255),
                unique: true,
                allowNull: false,
            },
            mention:
            {
                type: DataTypes.STRING(255),
                unique: true,
                allowNull: false,
            },
            photo:{
                type: DataTypes.BLOB('long'),
                allowNull: true,
            },
            photoType:{
                type: DataTypes.TEXT,
                allowNull: true,
            },
            type:
            {
                type: DataTypes.ENUM('character', 'item'),
                allowNull: false,
            },
            data:
            {
                type: DataTypes.JSON,
                allowNull: true,
            }
        },

        {
            sequelize,
            modelName: "characterItem",
            timestamps: false,
        }
    )

    return characterItem;
}