const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

const LIST_BACKEND_URL =
  process.env.LIST_BACKEND_URL || "http://localhost:5001";
const ITEM_SERVICE_URL =
  process.env.ITEM_SERVICE_URL || "http://localhost:5006";
const PREFERENCE_BACKEND_URL =
  process.env.PREFERENCE_BACKEND_URL || "http://localhost:5005";
const GROCERY_BACKEND_URL =
  process.env.GROCERY_BACKEND_URL || "http://localhost:5004";

/**
 * ✅ Validate if the shopping list exists by list_id (Required)
 */
async function validateShoppingList(list_id, token) {
  try {
    if (!list_id) {
      throw new Error("Shopping list ID is required");
    }

    const url = `${LIST_BACKEND_URL}/api/shopping-lists/${list_id}`;
    console.log("Validating shopping list with URL:", url);

    const response = await axios.get(url, {
      headers: { Authorization: token },
    });

    if (response.status === 200) {
      console.log("Shopping list found:", response.data);
      return response.data;
    }

    return null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("Shopping list not found.");
      return null;
    }
    console.error("Error validating shopping list:", error.message);
    throw new Error("Error validating shopping list");
  }
}

/**
 * ✅ Validate or fetch an item by name from the Item Microservice (MongoDB)
 */
async function validateOrFetchItem(name, token) {
  try {
    if (!name) {
      throw new Error("Item name is required");
    }

    const url = `${ITEM_SERVICE_URL}/api/items/by-name/${encodeURIComponent(
      name
    )}`;
    console.log("Checking if item exists in MongoDB:", url);

    const response = await axios.get(url, {
      headers: { Authorization: token },
    });

    if (response.status === 200) {
      console.log("Item found:", response.data);
      return response.data;
    }

    return null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Item '${name}' not found in MongoDB.`);
      return null;
    }
    console.error("Error validating or fetching item:", error.message);
    throw new Error("Error validating or fetching item");
  }
}

/**
 * ✅ Create a shopping list by calling the List Backend API.
 * Expects shopping list data (e.g., { name: "My Shopping List" })
 * and a valid token for authentication.
 */
async function createShoppingList(data, token) {
  try {
    if (!data.name) {
      throw new Error("Shopping list name is required");
    }
    const url = `${LIST_BACKEND_URL}/api/shopping-lists/`;
    console.log("Creating shopping list with URL:", url);

    const response = await axios.post(url, data, {
      headers: { Authorization: token },
    });

    console.log("Created shopping list:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating shopping list:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error creating shopping list");
  }
}

/**
 * Get all preferences for a given user.
 * Endpoint: GET /api/userPreference/:user_id
 * Example URL: http://localhost:5005/api/userPreference/13
 *
 * @param {number|string} user_id - The ID of the user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The user preferences.
 */
async function getUserPreferences(user_id, token) {
  try {
    if (!user_id) {
      throw new Error("User ID is required");
    }
    const url = `${PREFERENCE_BACKEND_URL}/api/userPreference/${user_id}`;
    console.log("Fetching user preferences with URL:", url);
    const response = await axios.get(url, {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      console.log("User preferences:", response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(
      "Error fetching user preferences:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching user preferences");
  }
}

/**
 * Get grocery items by status.
 * Endpoint: GET /api/groceryitems/status
 * Example URL: http://localhost:5004/api/groceryitems/status?status=fresh
 *
 * @param {string} status - The status to filter grocery items (e.g., 'fresh', 'expired').
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The grocery items data.
 */
async function getGroceriesByStatus(status, token) {
  try {
    if (!status) {
      throw new Error("Status is required");
    }
    const url = `${GROCERY_BACKEND_URL}/api/groceryitems/status?status=${encodeURIComponent(
      status
    )}`;
    console.log("Fetching grocery items by status with URL:", url);
    const response = await axios.get(url, {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      console.log("Grocery items by status:", response.data);
      return response.data;
    }
    return null;
  } catch (error) {
    console.error(
      "Error fetching groceries by status:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Error fetching groceries by status");
  }
}
module.exports = {
  validateShoppingList,
  validateOrFetchItem,
  createShoppingList,
  getUserPreferences,
  getGroceriesByStatus,
};
