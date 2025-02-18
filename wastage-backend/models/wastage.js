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
    item_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    item_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    item_unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    wasted_quantity: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    wastage_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    reason_for_waste: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    wasted_money: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Prevent Sequelize from creating updatedAt/createdAt
  }
);

module.exports = Wastage;
