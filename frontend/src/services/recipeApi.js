import { recipeAPI } from "./api";

// Fetch all recipes
export const fetchAllRecipes = async (token) => {
  try {
    const response = await recipeAPI.get("/recipes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Generate new recipes
export const generateRecipes = async (token) => {
  try {
    const response = await recipeAPI.post("/recipes/generate", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Get a specific recipe by ID
export const getRecipeById = async (token, recipeId) => {
  try {
    const response = await recipeAPI.get(`/recipes/${recipeId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe with ID ${recipeId}:`, error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Save a recipe to favorites (if you implement this feature later)
export const saveRecipe = async (token, recipeId) => {
  try {
    const response = await recipeAPI.post(`/recipes/${recipeId}/save`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error saving recipe with ID ${recipeId}:`, error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};