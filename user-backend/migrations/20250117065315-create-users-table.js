"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      shoppingActivity: {
        type: Sequelize.ENUM("daily", "weekly", "biweekly", "monthly"),
        defaultValue: "daily",
      },
      dietPreference: {
        type: Sequelize.ENUM(
          "none",
          "vegan",
          "vegetarian",
          "pescatarian",
          "keto"
        ),
        defaultValue: "none",
      },
      cookingForPeople: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      cuisinePreference: {
        type: Sequelize.ENUM(
          "none",
          "indian",
          "korean",
          "chinese",
          "italian",
          "mexican"
        ),
        defaultValue: "none",
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      resetToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetTokenExpiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
