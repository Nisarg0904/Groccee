// shopping-list-item-backend/models/shoppingListItem.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("ShoppingListItem", {
    list_item_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    shopping_list_id: {
      type: DataTypes.INTEGER,
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
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    suggestion: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    bought: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
