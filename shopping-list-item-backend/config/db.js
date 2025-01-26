const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  }
);

const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log("Shopping List Item DB connected successfully!");
      return;
    } catch (err) {
      console.error(`DB Connection failed (Attempt ${i + 1}):`, err.message);
      if (i < retries - 1) await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.error("Unable to connect to the Shopping List Item DB after retries");
  process.exit(1);
};

module.exports = { sequelize, connectDB };
