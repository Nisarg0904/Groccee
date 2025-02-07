"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the generated_date column
    await queryInterface.removeColumn("ShoppingLists", "generated_date");
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Add back the generated_date column
    await queryInterface.addColumn("ShoppingLists", "generated_date", {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },
};
