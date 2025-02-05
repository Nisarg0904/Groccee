const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ShoppingListItem = sequelize.define("ShoppingListItem", {
  list_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  shopping_list_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DOUBLE, // Updated to DOUBLE for precision
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Price instead of expected/actual price
    allowNull: false,
  },
  suggestion: {
    type: DataTypes.STRING, // Suggestion field for recommendations
    allowNull: true,
  },
});

module.exports = ShoppingListItem;
