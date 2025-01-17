const Recipe = require('../models/recipe'); 
const { validateUser } = require('../utils/apiHelper'); 

// Create a new recipe
const createRecipe = async (req, res) => {
  const { user_id, name, ingredients, instructions, category, preparationTime } = req.body;

  try {
    const isValidUser = await validateUser(user_id);
    if (!isValidUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recipe = new Recipe({
      user_id,
      name,
      ingredients,
      instructions,
      category,
      preparationTime,
    });

    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error creating recipe' });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching recipes' });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error fetching recipe' });
  }
};

// Update a recipe by ID
const updateRecipeById = async (req, res) => {
  const { id } = req.params;
  const { name, ingredients, instructions, category, preparationTime } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { name, ingredients, instructions, category, preparationTime },
      { new: true } 
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(updatedRecipe);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error updating recipe' });
  }
};

// Delete a recipe by ID
const deleteRecipeById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipeById,
  deleteRecipeById,
};
