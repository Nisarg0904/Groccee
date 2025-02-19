require("dotenv").config(); // Load .env variables
const { Sequelize } = require("sequelize");

const wastageDB = new Sequelize(
  process.env.WASTAGE_DB_NAME,
  process.env.WASTAGE_DB_USER,
  process.env.WASTAGE_DB_PASS,
  {
    host: process.env.WASTAGE_DB_HOST || "localhost",
    port: process.env.WASTAGE_DB_PORT || 5437,
    dialect: "postgres",
    logging: false, // Disable logging for cleaner console output
  }
);

module.exports = wastageDB;
