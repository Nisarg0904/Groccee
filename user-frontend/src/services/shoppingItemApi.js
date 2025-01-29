import { shoppingItemAPI } from "./api";

// Fetch all items in a shopping list
export const fetchShoppingListItems = async (shoppingListId, token) => {
  try {
    const response = await shoppingItemAPI.get(
      `/shopping-list-items/${shoppingListId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token here
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
