const axios = require('axios');

require('dotenv').config();

const { USER_SERVICE_URL, ITEM_SERVICE_URL, RECIPE_SERVICE_URL } = process.env;


async function validateUserId(userId) {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/api/users/${userId}`);
    return response.status === 200; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('User does not exist in the User service.');
    }
    throw new Error('Error communicating with the User service.');
  }
}


async function validateItemId(itemId) {
  if (!itemId) return true; 
  try {
    const response = await axios.get(`${ITEM_SERVICE_URL}/api/items/${itemId}`);
    return response.status === 200; 
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Item does not exist in the Item service.');
    }
    throw new Error('Error communicating with the Item service.');
  }
}


async function validateRecipeId(recipeId) {
  if (!recipeId) return true; // If no recipeId, skip validation
  try {
    const response = await axios.get(`${RECIPE_SERVICE_URL}/api/recipes/${recipeId}`);
    return response.status === 200; // Assumes a 200 status code means the recipe exists
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('Recipe does not exist in the Recipe service.');
    }
    throw new Error('Error communicating with the Recipe service.');
  }
}


async function validateUserPreference(preference) {
  const { userId, likedItemId, dislikedItemId, mostCookedRecipeId } = preference;

  const userValid = await validateUserId(userId);
  const likedItemValid = await validateItemId(likedItemId);
  const dislikedItemValid = await validateItemId(dislikedItemId);
  const recipeValid = await validateRecipeId(mostCookedRecipeId);

  if (!userValid) throw new Error('Invalid userId: User does not exist.');
  if (!likedItemValid) throw new Error('Invalid likedItemId: Item does not exist.');
  if (!dislikedItemValid) throw new Error('Invalid dislikedItemId: Item does not exist.');
  if (!recipeValid) throw new Error('Invalid mostCookedRecipeId: Recipe does not exist.');

  return true;
}

module.exports = {
  validateUserId,
  validateItemId,
  validateRecipeId,
  validateUserPreference,
};
