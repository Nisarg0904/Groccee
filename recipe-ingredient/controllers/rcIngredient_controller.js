const RecipeIngredient = require('../models/recipe_ingredient');
const { validateRecipe, validateItem } = require('../utils/apiHelper');

// Create a recipe ingredient
async function createRecipeIngredient(req, res) {
    const { ingredientId, itemId, recipeId, quantity } = req.body;
  
    try {
      // Validate recipeId and itemId
      await validateRecipe(recipeId);
      await validateItem(itemId);
  
      // Create recipe ingredient
      const recipeIngredient = await RecipeIngredient.create({
        ingredientId,
        itemId,
        recipeId,
        quantity,
      });
  
      res.status(201).json(recipeIngredient);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

// Get all recipe ingredients
async function getAllRecipeIngredients(req, res) {
  try {
    const recipeIngredients = await RecipeIngredient.findAll();
    res.status(200).json(recipeIngredients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe ingredients' });
  }
}

// Get a recipe ingredient by ID
async function getRecipeIngredientById(req, res) {
  const { id } = req.params;

  try {
    const recipeIngredient = await RecipeIngredient.findByPk(id);
    if (!recipeIngredient) {
      return res.status(404).json({ error: 'Recipe ingredient not found' });
    }

    res.status(200).json(recipeIngredient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe ingredient' });
  }
}

// Update a recipe ingredient
async function updateRecipeIngredient(req, res) {
  const { id } = req.params;
  const { itemId, recipeId, quantity } = req.body;

  try {
    // Validate itemId and recipeId if provided
    if (itemId) await validateItem(itemId);
    if (recipeId) await validateRecipe(recipeId);

    // Update the recipe ingredient
    const updated = await RecipeIngredient.update(
      { itemId, recipeId, quantity },
      { where: { ingredientId: id } }
    );

    if (!updated[0]) {
      return res.status(404).json({ error: 'Recipe ingredient not found' });
    }

    res.status(200).json({ message: 'Recipe ingredient updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a recipe ingredient
async function deleteRecipeIngredient(req, res) {
  const { id } = req.params;

  try {
    const deleted = await RecipeIngredient.destroy({ where: { ingredientId: id } });

    if (!deleted) {
      return res.status(404).json({ error: 'Recipe ingredient not found' });
    }

    res.status(200).json({ message: 'Recipe ingredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe ingredient' });
  }
}

module.exports = {
  createRecipeIngredient,
  getAllRecipeIngredients,
  getRecipeIngredientById,
  updateRecipeIngredient,
  deleteRecipeIngredient,
};
