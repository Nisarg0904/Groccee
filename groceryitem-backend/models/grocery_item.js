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
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    default_packaging: {
      type: DataTypes.JSONB, // JSON field to store packaging details
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "grocery_item",
    timestamps: false,
  }
);

module.exports = GroceryItem;

// // Define associations
// GroceryItem.associate = (models) => {
//   const { User } = models; // Destructure User model from models
//   GroceryItem.belongsTo(User, {
//     foreignKey: "user_id",
//     targetKey: "id", // Assuming "id" is the primary key in the User table
//     onDelete: "CASCADE",
//     onUpdate: "CASCADE",
//   });
// };

// module.exports = GroceryItem;
