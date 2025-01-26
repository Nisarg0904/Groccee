const { DataTypes } = require("sequelize");
const wastageDB = require("../config/wastage_db");

const Wastage = wastageDB.define(
  "Wastage",
  {
    wastage_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    wasted_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason_for_waste: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    grocery_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Disable automatic timestamps
  }
);

module.exports = Wastage;
