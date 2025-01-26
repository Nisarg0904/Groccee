const axios = require("axios");
const mongoose = require("mongoose");

const SHOPPING_LIST_BACKEND_URL =
  process.env.SHOPPING_LIST_BACKEND_URL || "http://localhost:5001";
const ITEM_SERVICE_URL =
  process.env.ITEM_SERVICE_URL || "http://localhost:5006";

/**
 * Validate if the shopping list exists by name and user_id
 */
/**
 * Validate if the shopping list exists by name and user_id or by list_id
 */
async function validateShoppingList({ name, list_id }, token) {
  try {
    let response;

    // If `list_id` is provided, fetch the shopping list by ID
    if (list_id) {
      response = await axios.get(
        `${SHOPPING_LIST_BACKEND_URL}/api/shopping-lists/${list_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else if (name) {
      // Fetch the shopping list by name for the authenticated user
      response = await axios.get(
        `${SHOPPING_LIST_BACKEND_URL}/api/shopping-lists/search?name=${encodeURIComponent(
          name
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      throw new Error("Either list_id or name must be provided");
    }

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Shopping list not found
    }
    throw new Error("Error validating shopping list");
  }
}



/**
 * Create a new shopping list
 * - Adds `purchased` flag for default shopping lists.
 */
async function createShoppingList(name, user_id, token, purchased = false) {
  try {
    const shoppingListData = {
      name,
      user_id,
    };

    if (purchased) {
      shoppingListData.purchased = true; // Indicates the list is bought
    }

    const response = await axios.post(
      `${SHOPPING_LIST_BACKEND_URL}/api/shopping-lists`,
      shoppingListData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Error creating shopping list");
  }
}

/**
 * Validate or fetch an item by ID or name
 */


async function validateOrFetchItem(itemIdentifier, token) {
  try {
    let response;

    // Determine if the identifier is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(itemIdentifier)) {
      // Fetch by ID
      response = await axios.get(
        `${ITEM_SERVICE_URL}/api/items/${itemIdentifier}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      // Fetch by name
      response = await axios.get(
        `${ITEM_SERVICE_URL}/api/items/by-name/${itemIdentifier.toLowerCase()}`, // Convert name to lowercase
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    // If the item exists, return the data
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle item not found (404) error
    if (error.response && error.response.status === 404) {
      return null; // Item not found
    }

    // Throw other errors
    console.error("Error validating or fetching item:", error.message);
    throw new Error("Error validating or fetching item");
  }
}




/**
 * Create a new item with minimal information
 */
async function createItem(name, user_id, token, packaging = {}) {
  try {
    const minimalItemData = {
      name: name.toLowerCase() || "unnamed item", // Ensure name is lowercase
      unit: packaging.unit || "unknown", // Default unit
      price_per_unit: packaging.price || 0, // Default price
      default_packaging: packaging.quantity ? [packaging] : [], // Add packaging only if provided
      user_id, // User ID for ownership
    };

    console.log("Creating item with data:", minimalItemData); // Debugging log

    const response = await axios.post(
      `${ITEM_SERVICE_URL}/api/items`,
      minimalItemData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error creating item:",
      error.response?.data || error.message
    ); // Log backend error
    throw new Error("Error creating item");
  }
}


module.exports = {
  validateShoppingList,
  createShoppingList,
  validateOrFetchItem,
  createItem,
};
