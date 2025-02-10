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