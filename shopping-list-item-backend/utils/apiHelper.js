const axios = require("axios");
const mongoose = require("mongoose");

const LIST_BACKEND_URL = process.env.LIST_BACKEND_URL || "http://localhost:5001";
const ITEM_SERVICE_URL = process.env.ITEM_SERVICE_URL || "http://localhost:5006";


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

// async function fetchShoppingListByName(name, token) {
//   try {
//     if (!name) {
//       throw new Error("Shopping list name is required");
//     }

//     const url = `${LIST_BACKEND_URL}/api/shopping-lists/search?name=${encodeURIComponent(name)}`;
//     console.log("🔍 Fetching shopping list with URL:", url);

//     const response = await axios.get(url, {
//       headers: { Authorization: token },
//     });

//     if (response.status === 200 && response.data) {
//       console.log("✅ Shopping list found:", response.data);
//       return response.data;
//     }

//     console.error("❌ Shopping list not found.");
//     return null;
//   } catch (error) {
//     if (error.response) {
//       console.error(`❌ Shopping List API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
//     } else {
//       console.error("❌ Network Error:", error.message);
//     }
//     throw new Error("Error fetching shopping list");
//   }
// }

/**
 * ✅ Validate or fetch an item by name from the Item Microservice (MongoDB)
 */
async function validateOrFetchItem(name, token) {
  try {
    if (!name) {
      throw new Error("Item name is required");
    }

    const url = `${ITEM_SERVICE_URL}/api/items/by-name/${encodeURIComponent(name)}`;
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

module.exports = {
  validateShoppingList,
  validateOrFetchItem,
  // fetchShoppingListByName,
};