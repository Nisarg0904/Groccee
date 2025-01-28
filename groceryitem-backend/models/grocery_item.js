const { DataTypes } = require("sequelize");
const groceryItemDB = require("../config/groceryitem_db");

const GroceryItem = groceryItemDB.define(
  "GroceryItem",
  {
    grocery_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    item_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchased_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    purchased_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    purchased_quantity: {
      type: DataTypes.INTEGER, // Total quantity when purchased
      allowNull: false,
    },
    available_quantity: {
      type: DataTypes.INTEGER, // Quantity remaining
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
    type: DataTypes.STRING(50), // 'active', 'expired', or 'wasted'
    defaultValue: "active",
    },
  },
  {
    tableName: "grocery_item",
    timestamps: false,
  }
);

module.exports = GroceryItem;
