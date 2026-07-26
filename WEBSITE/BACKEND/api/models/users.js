const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) =>
{
    class Users extends Model {};

    Users.init
    (
        {
             id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            steamId: {
                type: DataTypes.STRING(50),
                unique: true,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            role: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'user',
            },
        },
        {
            sequelize,
            modelName: "Users",
            timestamps: true,
        }
    )

    return Users;
}