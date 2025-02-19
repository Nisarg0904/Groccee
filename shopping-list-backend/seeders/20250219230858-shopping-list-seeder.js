"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ShoppingLists", [
      {
        name: "Weekly Groceries",
        status: "Pending",
        purchased_date: null,
        user_id: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Birthday Party Supplies",
        status: "Purchased",
        purchased_date: new Date("2024-12-20"),
        user_id: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Holiday Shopping",
        status: "Pending",
        purchased_date: null,
        user_id: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Camping Essentials",
        status: "Purchased",
        purchased_date: new Date("2024-11-15"),
        user_id: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Monthly Bulk Shopping",
        status: "Pending",
        purchased_date: null,
        user_id: 13,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ShoppingLists", null, {});
  },
};
