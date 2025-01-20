const axios = require("axios");

const RECIPE_BACKEND_URL = process.env.RECIPE_BACKEND_URL || 'http://localhost:5007';
const ITEM_BACKEND_URL = process.env.ITEM_BACKEND_URL || 'http://localhost:5006';

// Validate recipeId from Recipe Service
const validateRecipe = async (recipeId) => {
  try {
    const response = await axios.get(`${RECIPE_BACKEND_URL}/api/recipes/${recipeId}`);
    if (response.status === 200) {
      return true; // Validation successful
    }
    throw new Error('Recipe not found');
  } catch (error) {
    throw new Error('Error validating recipeId: ' + error.message);
  }
};


// Validate itemId from Item Service
const validateItem = async (itemId) => {
  try {
    const response = await axios.get(`${ITEM_BACKEND_URL}/api/items/${itemId}`);
    if (response.status === 200) {
      return true; // Validation successful
    }
    throw new Error('Item not found');
  } catch (error) {
    throw new Error('Error validating itemId: ' + error.message);
  }
};


module.exports = { validateRecipe, validateItem };
