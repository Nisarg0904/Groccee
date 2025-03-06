const Recipe = require("../models/recipe");

// ✅ Add a new recipe (with step-by-step instructions)
exports.addRecipe = async (req, res) => {
  try {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res
      .status(201)
      .json({ message: "Recipe added successfully!", recipe: newRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all recipes (includes steps)
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get recipe by ID (includes steps)
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found!" });
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get recipes by cuisine (includes steps)
exports.getRecipesByCuisine = async (req, res) => {
  try {
    const recipes = await Recipe.find({ cuisine: req.params.cuisine });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get recipes by max cooking time (includes steps)
exports.getRecipesByTime = async (req, res) => {
  try {
    const recipes = await Recipe.find({
      timeToCook: { $lte: req.params.minutes },
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get recipes sorted by date created (latest first, includes steps)
exports.getRecipesSortedByDate = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe)
      return res.status(404).json({ message: "Recipe not found!" });
    res.status(200).json({ message: "Recipe deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a recipe (includes updating steps)
exports.updateRecipe = async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedRecipe)
      return res.status(404).json({ message: "Recipe not found!" });
    res
      .status(200)
      .json({ message: "Recipe updated successfully!", recipe: updatedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get recipes based on available ingredients (includes steps)
exports.getRecipesByIngredients = async (req, res) => {
  try {
    const ingredientsList = req.query.ingredients.split(",");
    const recipes = await Recipe.find({
      "ingredients.ingredientName": { $in: ingredientsList },
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
