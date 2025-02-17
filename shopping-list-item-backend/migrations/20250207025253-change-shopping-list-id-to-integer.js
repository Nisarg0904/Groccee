"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Rename the old column (backup in case of rollback)
    await queryInterface.renameColumn("ShoppingListItems", "shopping_list_id", "shopping_list_id_old");

    // Step 2: Add a new column with INTEGER type
    await queryInterface.addColumn("ShoppingListItems", "shopping_list_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Step 3: Optional - Copy data from old column to new column (if needed)
    // await queryInterface.sequelize.query(`UPDATE "ShoppingListItems" SET shopping_list_id = CAST(shopping_list_id_old AS INTEGER);`);

    // Step 4: Drop the old column
    await queryInterface.removeColumn("ShoppingListItems", "shopping_list_id_old");
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Add back the UUID column for shopping_list_id
    await queryInterface.renameColumn("ShoppingListItems", "shopping_list_id", "shopping_list_id_old");

    await queryInterface.addColumn("ShoppingListItems", "shopping_list_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.removeColumn("ShoppingListItems", "shopping_list_id_old");
  },
};
