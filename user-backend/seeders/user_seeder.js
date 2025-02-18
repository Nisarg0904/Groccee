const bcrypt = require("bcrypt");
const { User } = require("../models/user");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Test@123", salt);

    await queryInterface.bulkInsert("Users", [
      {
        username: "nisarg_bhatti",
        firstName: "Nisarg",
        lastName: "Bhatti",
        email: "nisarg@example.com",
        password: await bcrypt.hash("password", 10),
        shoppingActivity: "weekly",
        dietPreference: "vegetarian",
        cookingForPeople: 1,
        cuisinePreference: "indian",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "fernando_solares",
        firstName: "Fernando",
        lastName: "Solares",
        email: "fernando@example.com",
        password: await bcrypt.hash("password", 10),
        shoppingActivity: "biweekly",
        dietPreference: "none",
        cookingForPeople: 2,
        cuisinePreference: "mexican",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "kashyap_mavani",
        firstName: "Kashyap",
        lastName: "Mavani",
        email: "kashyap@example.com",
        password: await bcrypt.hash("password", 10),
        shoppingActivity: "monthly",
        dietPreference: "keto",
        cookingForPeople: 3,
        cuisinePreference: "italian",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "helly_chauhan",
        firstName: "Helly",
        lastName: "Chauhan",
        email: "helly@example.com",
        password: await bcrypt.hash("password", 10),
        shoppingActivity: "daily",
        dietPreference: "vegan",
        cookingForPeople: 1,
        cuisinePreference: "korean",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
