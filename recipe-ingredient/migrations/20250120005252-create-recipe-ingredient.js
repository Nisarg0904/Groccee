'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipeIngredient', {
      ingredientId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      itemId: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      recipeId: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      quantity: {
        type: Sequelize.STRING, 
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('recipeIngredient');
  },
};
