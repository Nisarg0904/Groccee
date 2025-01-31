const axios = require("axios");

const USER_BACKEND_URL = process.env.USER_BACKEND_URL || "http://localhost:5000";
const GROCERYITEM_BACKEND_URL = process.env.GROCERYITEM_BACKEND_URL || "http://localhost:5004";

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
async function validateItem(groceryitemId) {
  try {
    const response = await axios.get(`${GROCERYITEM_BACKEND_URL}/api/groceryitems/${groceryitemId}`);
    if (response.status === 200) {
      return true; 
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("GroceryItem does not exist");
    }
    console.error("Error validating grocery item:", error.message);
    throw new Error("Error validating item");
  }
}

module.exports = { validateUser, validateItem };




