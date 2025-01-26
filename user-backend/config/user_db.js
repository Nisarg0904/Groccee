// config/user_db.js

const { Sequelize } = require("sequelize");

const userDB = new Sequelize(
  process.env.USER_DB_NAME,
  process.env.USER_DB_USER,
  process.env.USER_DB_PASS,
  {
    host: process.env.USER_DB_HOST || "localhost",
    port: process.env.USER_DB_PORT || 5432,
    dialect: "postgres",
  }
);

module.exports = userDB;
