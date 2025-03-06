const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { generateRecipe } = require("../services/recipeAI");

// Create a new recipe
router.post("/", recipeController.addRecipe);

// Get all recipes
router.get("/", recipeController.getAllRecipes);

// Get a recipe by ID
router.get("/:id", recipeController.getRecipeById);

// Get recipes by cuisine
router.get("/cuisine/:cuisine", recipeController.getRecipesByCuisine);

// Get recipes by max cooking time
router.get("/time/:minutes", recipeController.getRecipesByTime);

// Get recipes sorted by creation date (latest first)
router.get("/sorted/date", recipeController.getRecipesSortedByDate);

// Delete a recipe by ID
router.delete("/:id", recipeController.deleteRecipe);

// (Optional) Update a recipe
router.put("/:id", recipeController.updateRecipe);

// (Optional) Get recipes based on available ingredients
router.get("/search", recipeController.getRecipesByIngredients);


// Generate recipe from grocery items
router.post("/generate", async (req, res) => {
  try {
    const groceryData = req.body; // Get grocery items from user
    const recipe = await generateRecipe(groceryData);
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});
module.exports = router;
