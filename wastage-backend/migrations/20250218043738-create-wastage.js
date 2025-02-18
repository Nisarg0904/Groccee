"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Wastage", {
      wastage_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      item_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      item_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      item_unit: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      wasted_quantity: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      wastage_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      reason_for_waste: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      wasted_money: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Wastage");
  },
};
