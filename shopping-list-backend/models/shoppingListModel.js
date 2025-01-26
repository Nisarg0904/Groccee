const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ShoppingList = sequelize.define(
  "ShoppingList",
  {
    list_id: {
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
    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    purchased_on: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "not_bought",
    },
  },
  {
    tableName: "ShoppingLists", // Explicit table name
  }
);

module.exports = ShoppingList;
