"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Rename the old column (backup in case of rollback)
    await queryInterface.renameColumn("ShoppingLists", "user_id", "user_id_old");

    // Step 2: Add a new column with INTEGER type
    await queryInterface.addColumn("ShoppingLists", "user_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Step 3: Optional - Copy data from old column to new column (if needed)
    // await queryInterface.sequelize.query(`UPDATE "ShoppingLists" SET user_id = CAST(user_id_old AS INTEGER);`);

    // Step 4: Drop the old column
    await queryInterface.removeColumn("ShoppingLists", "user_id_old");
  },

  down: async (queryInterface, Sequelize) => {
    // Rollback: Recreate the UUID column if needed
    await queryInterface.addColumn("ShoppingLists", "user_id_old", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.renameColumn("ShoppingLists", "user_id", "user_id_old");

    await queryInterface.addColumn("ShoppingLists", "user_id", {
      type: Sequelize.UUID,
      allowNull: false,
    });

    await queryInterface.removeColumn("ShoppingLists", "user_id_old");
  },
};
