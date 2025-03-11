const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema(
  {
    recipeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
      {
        ingredientName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    cuisine: { type: String, required: true },
    timeToCook: { type: Number, required: true }, // Time in minutes
    servings: { type: Number, required: true }, // Number of people it serves
    allergies: [
      {
        allergen: { type: String, required: true },
        severity: {
          type: String,
          enum: ["Mild", "Moderate", "Severe"],
          default: "Mild",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", RecipeSchema);
