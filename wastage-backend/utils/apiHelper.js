const axios = require("axios");
const mongoose = require("mongoose");

const USER_BACKEND_URL =
  process.env.USER_BACKEND_URL || "http://localhost:5000";
const GROCERYITEM_BACKEND_URL =
  process.env.GROCERYITEM_BACKEND_URL || "http://localhost:5004";
const ITEM_SERVICE_URL =
  process.env.ITEM_SERVICE_URL || "http://localhost:5006";

// Validate user_id via user-backend
async function validateUser(userId) {
  try {
    const response = await axios.get(`${USER_BACKEND_URL}/api/users/${userId}`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("User does not exist");
    }
    console.error("Error validating user:", error.message);
    throw new Error("Error validating user");
  }
}

// Validate item_id via groceryitem-backend
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

module.exports = { validateUser, validateOrFetchItem };
