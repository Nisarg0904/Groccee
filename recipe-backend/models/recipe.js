const mongoose = require("mongoose");

const RecipeSchema = new mongoose.Schema({
    recipeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
        {
            ingredientName: { type: String, required: true },
            quantity: { type: Number, required: true },
            unit: { type: String, required: true }
        }
    ],
    cuisine: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Recipe", RecipeSchema);
