const { Sequelize } = require("sequelize");

const groceryItemDB = new Sequelize(
  process.env.RECIPEINGREDIENT_DB_NAME, // Database name for recipe-ingredient
  process.env.RECIPEINGREDIENT_DB_USER, // Database user
  process.env.RECIPEINGREDIENT_DB_PASS, // Database password
  {
    host: process.env.RECIPEINGREDIENT_DB_HOST || "localhost", // Host
    port: process.env.RECIPEINGREDIENT_DB_PORT || 5434, // Port
    dialect: "postgres", // Database dialect
  }
);

module.exports = groceryItemDB;
