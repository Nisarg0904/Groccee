"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("grocery_item", "packaging", {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn("grocery_item", "packaging_quantity", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("grocery_item", "packaging");
    await queryInterface.removeColumn("grocery_item", "packaging_quantity");
  },
};
