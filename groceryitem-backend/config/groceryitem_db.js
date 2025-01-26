const { Sequelize } = require("sequelize");

const groceryItemDB = new Sequelize(
  process.env.GROCERY_DB_NAME, // Database name for grocery item
  process.env.GROCERY_DB_USER, // Database user
  process.env.GROCERY_DB_PASS, // Database password
  {
    host: process.env.GROCERY_DB_HOST || "localhost", // Host
    port: process.env.GROCERY_DB_PORT || 5432, // Port
    dialect: "postgres", // Database dialect
  }
);

module.exports = groceryItemDB;
