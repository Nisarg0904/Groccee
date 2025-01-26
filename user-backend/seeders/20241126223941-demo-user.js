"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        username: "john_doe",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10), // Hash password before seeding
        shoppingActivity: "weekly",
        dietPreference: "vegetarian",
        cookingForPeople: 2,
        cuisinePreference: "italian",
        isVerified: true, // Assume the user is verified
        resetToken: null, // No reset token initially
        resetTokenExpiry: null, // No expiry initially
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "jane_smith",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        shoppingActivity: "monthly",
        dietPreference: "vegan",
        cookingForPeople: 4,
        cuisinePreference: "mexican",
        isVerified: false, // Assume the user is not verified
        resetToken: "sample-reset-token", // Example reset token
        resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
