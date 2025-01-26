'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('grocery_item', {
      grocery_item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      item_id: {
        type: Sequelize.STRING(24),
        allowNull: false, // Store reference to MongoDB's item ID (handle consistency programmatically)
      },
      purchased_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      purchased_on: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      available_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Just store user_id as a plain integer
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('grocery_item');
  },
};
