const { Sequelize } = require("sequelize");

const wastageDB = new Sequelize(
  process.env.WASTAGE_DB_NAME, 
  process.env.WASTAGE_DB_USER, 
  process.env.WASTAGE_DB_PASS, 
  {
    host: process.env.WASTAGE_DB_HOST || "localhost", 
    port: process.env.WASTAGE_DB_PORT || 5434, 
    dialect: "postgres", 
  }
);

module.exports = wastageDB;
