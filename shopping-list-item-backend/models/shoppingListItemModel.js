const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ShoppingListItem = sequelize.define("ShoppingListItem", {
  list_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, // UUID for better scalability
    primaryKey: true,
  },  
  shopping_list_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.STRING, // Links to MongoDB's Item collection (Nullable)
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // Name is the only required field initially
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true, // Nullable, user can fill later
  },
  quantity: {
    type: DataTypes.DOUBLE, // Kept DOUBLE for precision
    allowNull: true, // Nullable, user can fill later
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Price field remains
    allowNull: true, // Nullable, user may add later
  },
  suggestion: {
    type: DataTypes.BOOLEAN, // Changed to BOOLEAN for ML recommendations
    defaultValue: false,
  },
  bought: {
    type: DataTypes.BOOLEAN, // New field to track if the item was purchased
    defaultValue: false,
  },
});

module.exports = ShoppingListItem;
