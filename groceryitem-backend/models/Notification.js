const { DataTypes } = require("sequelize");
const groceryItemDB = require("../config/groceryitem_db");

const Notification = groceryItemDB.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING, // 'expiry', 'shopping', 'system'
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    grocery_item_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Only required for expiry notifications
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }
  },
  {
    tableName: "notifications",
    timestamps: false, // This will add createdAt and updatedAt columns
  }
);

module.exports = Notification;