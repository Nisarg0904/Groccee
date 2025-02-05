const axios = require("axios");

const USER_BACKEND_URL =
  process.env.USER_BACKEND_URL || "http://localhost:5000";
const ITEM_BACKEND_URL =
  process.env.ITEM_BACKEND_URL || "http://localhost:5006";
const SHOPPING_LIST_BACKEND_URL =
  process.env.SHOPPING_LIST_BACKEND_URL || "http://localhost:5002";




/**
 * Validate or create an item and its packaging.
 * @param {string} itemName - Name of the item.
 * @param {object} packaging - Packaging details (unit).
 * @param {string} category - Category of the item (required only when creating).
 * @param {string} token - Authorization token.
 * @returns {object} - The validated or newly created item.
 */
async function validateItem(itemName, packaging, category, token) {
  try {
    // Step 1: Check if the item exists with the given name and packaging
    const itemExistsResponse = await axios.get(
      `${ITEM_BACKEND_URL}/api/items/exists?name=${encodeURIComponent(
        itemName.toLowerCase()
      )}&unit=${encodeURIComponent(packaging.unit.toLowerCase())}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Step 2: If the item and packaging exist, return the item
    if (itemExistsResponse.status === 200) {
      return itemExistsResponse.data.item;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("Item or packaging not found, adding or updating item.");

      // Step 3: Call `addOrUpdateUserItem` to create or update the item
      const addItemResponse = await axios.post(
        `${ITEM_BACKEND_URL}/api/items/add-or-update`,
        {
          name: itemName.toLowerCase(),
          category, // Only needed when creating an item
          selected_unit: packaging.unit,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return addItemResponse.data.item;
    }

    console.error("Error validating item:", error.message);
    throw new Error("Error validating item");
  }
}

module.exports = { validateItem };





