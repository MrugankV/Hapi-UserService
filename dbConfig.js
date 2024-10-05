const { Sequelize, DataTypes } = require("sequelize");

const dotenv = require("dotenv");
dotenv.config();
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST || "localhost",
    dialect: "mysql", // Change this to your database dialect (e.g., 'mysql')
    logging: false, // Disable logging
  }
);
module.exports = {
  sequelize: sequelize,
  DataTypes: DataTypes,
};
