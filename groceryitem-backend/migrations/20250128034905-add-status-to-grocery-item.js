'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("grocery_item", "status", {
      type: Sequelize.STRING(50), // Status column with a max length of 50 characters
      defaultValue: "active", // Default value is 'active'
      allowNull: false, // Cannot be null
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
