require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');

const sequelize = new Sequelize
(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,

    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: false,
    }
)

try
{
    sequelize.authenticate();

    console.log("Database Connection Successful");
}
catch(error)
{
    console.log(error.message);
}

const models = require("../models/index")(sequelize, DataTypes);

const db = {
    sequelize,
    Sequelize,
    ...models,
};
const initializeDatabase = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database "${process.env.DB_NAME}" created or already exists.`);
        await connection.end();

        await sequelize.sync({ alter: true });
        console.log('Database connected and models synchronized.');

        console.log('Database connected and tables created.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

initializeDatabase();

module.exports = db;