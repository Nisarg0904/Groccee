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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expected_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  actual_price: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = ShoppingListItem;
