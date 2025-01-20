const { DataTypes } = require("sequelize");
const recipeIngredientDB = require("../config/recipe_ingredient_db");

const RecipeIngredient = recipeIngredientDB.define("RecipeIngredient", {
  ingredientId: {
  type: DataTypes.STRING, // Keep it as a string
  primaryKey: true,
  defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
  allowNull: false,
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false, // Item ID from Item Service
  },
  recipeId: {
    type: DataTypes.STRING,
    allowNull: false, // Recipe ID from Recipe Service
  },
  quantity: {
    type: DataTypes.STRING, // e.g., "200g", "2 cups"
    allowNull: false,
  },
}, {
  tableName: "recipeIngredient",
  timestamps: false,
});

module.exports = RecipeIngredient;
