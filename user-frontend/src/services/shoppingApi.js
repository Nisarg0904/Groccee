import { shoppingAPI } from "./api";

// Fetch all shopping lists by status
export const fetchShoppingListsByStatus = async (status, token) => {
  try {
    const response = await shoppingAPI.get(`/shopping-lists/status/${status}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token here
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch shopping list details by ID
export const fetchShoppingListById = async (id, token) => {
  try {
    const response = await shoppingAPI.get(`/shopping-lists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token here
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
