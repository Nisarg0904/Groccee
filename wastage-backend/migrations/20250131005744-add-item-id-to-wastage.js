module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Wastages", "item_id", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "unknown", // ✅ Temporary default value to avoid NULL constraint errors
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Wastages", "item_id");
  },
};
