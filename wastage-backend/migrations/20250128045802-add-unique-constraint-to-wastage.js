'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint("Wastages", {
      fields: ["grocery_item_id"],
      type: "unique",
      name: "unique_grocery_item_id", // Constraint name
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Wastages", "unique_grocery_item_id");
  }
};
