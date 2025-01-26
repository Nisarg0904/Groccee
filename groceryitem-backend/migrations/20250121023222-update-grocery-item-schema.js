"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if "purchased_quantity" already exists
    const tableDescription = await queryInterface.describeTable("grocery_item");
    if (!tableDescription.purchased_quantity) {
      // Rename "quantity" to "purchased_quantity"
      await queryInterface.renameColumn(
        "grocery_item",
        "quantity",
        "purchased_quantity"
      );
    }

    // Skip adding "available_quantity" if it already exists
    if (!tableDescription.available_quantity) {
      await queryInterface.addColumn("grocery_item", "available_quantity", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0, // Set a default value for existing rows
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverse the schema changes

    // Rename "purchased_quantity" back to "quantity"
    const tableDescription = await queryInterface.describeTable("grocery_item");
    if (tableDescription.purchased_quantity) {
      await queryInterface.renameColumn(
        "grocery_item",
        "purchased_quantity",
        "quantity"
      );
    }

    // Remove "available_quantity" column if it exists
    if (tableDescription.available_quantity) {
      await queryInterface.removeColumn("grocery_item", "available_quantity");
    }
  },
};
