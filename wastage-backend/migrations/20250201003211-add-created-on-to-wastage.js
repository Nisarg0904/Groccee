module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Wastages", "created_on", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Wastages", "created_on");
  },
};
