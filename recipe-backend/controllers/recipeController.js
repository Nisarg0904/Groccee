// controllers/recipeController.js
require("dotenv").config(); // Ensure environment variables are loaded
const axios = require("axios");
const moment = require("moment");
const Recipe = require("../models/recipe"); // Mongoose model

async function generateRecipes(req, res) {
  try {
    // Auth middleware should have set req.user and the JWT token is in the header
    const userId = req.user.id;
    const token = req.header("Authorization");

    // 1) Fetch grocery data from the grocery microservice using the env URL
    const groceryUrl = `${process.env.GROCERYITEM_BACKEND_URL}/api/groceryitems`;
    const groceryResponse = await axios.get(groceryUrl, {
      headers: { Authorization: token },
    });
    const groceryItems = groceryResponse.data; 

    // 2) Filter items (those expiring in 2-3 days)
    const today = moment();
    const relevantItems = groceryItems.filter(item => {
      if (!item.expiry_date) return false; 
      const expiry = moment(item.expiry_date, "YYYY-MM-DD");
      const daysToExpiry = expiry.diff(today, "days");
      return daysToExpiry >= 2 && daysToExpiry <= 3;
    });

    // 3) Send both expiring and all grocery items to your Python ML service
    const pythonUrl = "http://localhost:6001/generate-recipes";
    const pythonResponse = await axios.post(pythonUrl, { 
      expiringGroceries: relevantItems,
      allGroceries: groceryItems
    });
    const recommendedRecipes = pythonResponse.data;

    // 4) Save recommended recipes in MongoDB using the Recipe schema
    const savedRecipes = [];
    for (const recipeData of recommendedRecipes) {
      let recipe = await Recipe.findOne({ recipeId: recipeData.recipeId });
      if (recipe) {
        // Update the existing recipe
        recipe.name = recipeData.name;
        recipe.description = recipeData.description;
        recipe.ingredients = recipeData.ingredients;
        recipe.cuisine = recipeData.cuisine;
        recipe.timeToCook = recipeData.timeToCook;
        recipe.servings = recipeData.servings;
        recipe.allergies = recipeData.allergies;
        await recipe.save();
      } else {
        // Create a new recipe if it doesn't exist
        recipe = new Recipe({
          recipeId: recipeData.recipeId,
          name: recipeData.name,
          description: recipeData.description,
          ingredients: recipeData.ingredients,
          cuisine: recipeData.cuisine,
          timeToCook: recipeData.timeToCook,
          servings: recipeData.servings,
          allergies: recipeData.allergies,
        });
        await recipe.save();
      }
      savedRecipes.push(recipe);
    }

    // 5) Return the saved recipes to the client
    return res.status(200).json({
      message: "Recipes generated successfully",
      recipes: savedRecipes,
    });
  } catch (error) {
    console.error("Error generating recipes:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { generateRecipes };
