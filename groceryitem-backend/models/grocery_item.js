const { DataTypes } = require("sequelize");
const groceryItemDB = require("../config/groceryitem_db");

const GroceryItem = groceryItemDB.define(
  "GroceryItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    item_id: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchased_quantity: {
      type: DataTypes.DOUBLE, // Changed to DOUBLE
      allowNull: false,
    },
    available_quantity: {
      type: DataTypes.DOUBLE, // Changed to DOUBLE
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_per_unit: {
      type: DataTypes.DECIMAL(10, 2), // Price divided by quantity
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    purchased_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING, // e.g., "fresh", "expired", "used"
      allowNull: false,
    },
  },
  {
    tableName: "grocery_item",
    timestamps: false,
  }
);

module.exports = GroceryItem;
