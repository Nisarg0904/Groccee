const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ShoppingList = sequelize.define("ShoppingList", {
  shopping_list_id: {
    type: DataTypes.INTEGER,
    autoIncrement : true, // Generates a unique UUID for each shopping list
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Shopping list must have a name
  },
  status: {
    type: DataTypes.ENUM("Pending", "Purchased"),
    defaultValue: "Pending", // Default status is "Pending"
  },
  purchased_date: {
    type: DataTypes.DATE,
    allowNull: true, // Nullable, only set when items are purchased
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Each shopping list belongs to a user
  },
});

module.exports = ShoppingList;
