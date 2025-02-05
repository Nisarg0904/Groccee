"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("shopping_list_item", {
      list_item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      shopping_list_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DOUBLE, // Using DOUBLE for precision
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2), // Replacing expected/actual price
        allowNull: false,
      },
      suggestion: {
        type: Sequelize.STRING, // Optional suggestions
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("shopping_list_item");
  },
};
