'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('grocery_item', 'item_id', {
      type: Sequelize.STRING(24), // Change the column to STRING(24)
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('grocery_item', 'item_id', {
      type: Sequelize.INTEGER, // Revert back to INTEGER
      allowNull: false,
    });
  },
};
