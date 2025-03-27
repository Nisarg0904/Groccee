// services/shoppingItemApi.js
import { shoppingItemAPI } from "../api/api";

// Fetch all items in a shopping list
export const fetchShoppingListItems = async (shoppingListId, token) => {
  try {
    const response = await shoppingItemAPI.get(
      `/shopping-list-items/list/${shoppingListId}`,  // Updated endpoint path
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Create a new shopping list item
export const createShoppingListItem = async (itemData, token) => {
  try {
    const response = await shoppingItemAPI.post(
      "/shopping-list-items",
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Create multiple shopping list items
// services/shoppingItemApi.js
export const createMultipleShoppingListItems = async (items, shopping_list_id, token) => {
  try {
    const itemPromises = items.map(item => 
      createShoppingListItem({
        shopping_list_id,
        name: item.name,
        unit: item.unit || null,  // Make unit optional
        quantity: item.quantity ? parseFloat(item.quantity) : null,  // Make quantity optional
      }, token)
    );
    
    const results = await Promise.all(itemPromises);
    return results;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const updateShoppingListItem = async (itemId, updates, token) => {
  try {
    const response = await shoppingItemAPI.put(
      `/shopping-list-items/${itemId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.shoppingListItem; // Since your endpoint returns { message, shoppingListItem }
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Delete a shopping list item
export const deleteShoppingListItem = async (itemId, token) => {
  try {
    const response = await shoppingItemAPI.delete(
      `/shopping-list-items/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Returns { message: "Shopping list item deleted successfully" }
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

import { groceryAPI,globalItemAPI } from "./api";

// Fetch suggested items based on user input
export const fetchSuggestedItems = async (query) => {
  try {
    const response = await globalItemAPI.get(`/global/search/${query}`); // Ensure this matches your backend
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested items:", error);
    return [];
  }
};


// Add a new grocery item
export const addGroceryItem = async (token, groceryData) => {
  try {
    const response = await groceryAPI.post("/groceryitems", groceryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};




// Fetch all grocery items
export const fetchGroceries = async (token,) => {
  try {
    const response = await groceryAPI.get("/groceryitems", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchGroceries:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};


// Update a grocery item
export const updateGroceryItem = async (token, id, updatedData) => {
  try {
    const response = await groceryAPI.put(`/groceryitems/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Delete a grocery item
export const deleteGroceryItem = async (token, id) => {
  try {
    const response = await groceryAPI.delete(`/groceryitems/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const createGroceryItemFromShoppingItem = async (groceryData, token) => {
  try {
    const response = await groceryAPI.post(
      "/groceryitems",
      groceryData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
// Generate a shopping list using ML suggestions
export const generateShoppingList = async (token) => {
  try {
    const response = await shoppingItemAPI.post(
      "/shopping-list-items/generate",
      {}, // No body required
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
