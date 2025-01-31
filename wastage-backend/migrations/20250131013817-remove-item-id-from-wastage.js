module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Wastages", "item_id"); // ✅ Remove item_id column
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Wastages", "item_id", {
      type: Sequelize.STRING,
      allowNull: false, // If needed, adjust constraints accordingly
    });
  },
};
