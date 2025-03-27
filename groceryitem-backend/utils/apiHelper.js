const axios = require("axios");

const USER_BACKEND_URL =
  process.env.USER_BACKEND_URL || "http://localhost:5000";
const ITEM_BACKEND_URL =
  process.env.ITEM_BACKEND_URL || "http://localhost:5006";
const SHOPPING_LIST_BACKEND_URL =
  process.env.SHOPPING_LIST_BACKEND_URL || "http://localhost:5002";
const WASTAGE_BACKEND_URL =
  process.env.WASTAGE_BACKEND_URL || "http://localhost:5003"; // Change to your actual wastage service URL

/**
 * Push expired items to wastage database.
 * @param {object} item - The expired item data.
 * @param {string} token - Authorization token.
 */
async function addWastage(item, token) {
  try {
    const response = await axios.post(
      `${WASTAGE_BACKEND_URL}/api/wastage/system`,
      {
        item_id: item.item_id,
        item_name: item.name,
        item_unit: item.unit,
        wasted_quantity: item.available_quantity, // Since it's expired, consider all as wasted
        wastage_date: new Date().toISOString(),
        reason_for_waste: "Expired",
        category: item.category,
        wasted_money: item.price_per_unit * item.available_quantity, // Assuming item has a price_per_unit field
        user_id: item.user_id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Expired item pushed to wastage:", response.data);
  } catch (error) {
    console.error(
      "❌ Error adding wastage:",
      error.response?.data || error.message
    );
  }
}

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

/**
 * Update an existing user item.
 * @param {string} itemName - Existing name of the item.
 * @param {object} updatedData - Data to update (`new_name`, `category`, `packaging`).
 * @param {string} token - Authorization token.
 * @returns {object} - The updated item.
 */
async function updateUserItem(itemName, updatedData, token) {
  try {
    console.log("🟡 Updating Item:", { itemName, updatedData }); // ✅ Debugging Step

    const response = await axios.put(
      `${ITEM_BACKEND_URL}/api/items/`,
      {
        name: itemName, // Required field
        ...updatedData, // Contains new_name, category, or packaging
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("🟢 Item Updated Successfully:", response.data.item); // ✅ Debugging Step
    return response.data.item; // Return updated item
  } catch (error) {
    console.error(
      "❌ Error updating item:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to update item.");
  }
}

/**
 * Update times_bought and times_wasted for a specific packaging unit.
 * @param {string} itemId - The ID of the item.
 * @param {string} unit - The unit of packaging to update.
 * @param {number} timesBought - New times bought value.
 * @param {number} timesWasted - New times wasted value.
 * @param {string} token - Authorization token.
 * @returns {object} - The updated item.
 */
async function updatePackagingMetrics(
  itemId,
  unit,
  timesBought,
  timesWasted,
  token
) {
  try {
    console.log("🟡 Updating Packaging Metrics:", {
      itemId,
      unit,
      timesBought,
      timesWasted,
    });

    const response = await axios.put(
      `${ITEM_BACKEND_URL}/api/items/update-packaging`,
      {
        item_id: itemId,
        unit,
        times_bought: timesBought,
        times_wasted: timesWasted,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(
      "🟢 Packaging Metrics Updated Successfully:",
      response.data.item
    );
    return response.data.item; // Return updated item
  } catch (error) {
    console.error(
      "❌ Error updating packaging metrics:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update packaging metrics."
    );
  }
}

/**
 * Get all wastage records for a given item ID (public endpoint, no token required).
 * @param {string} itemId - The ID of the item.
 * @returns {object} - The wastage records.
 */
async function getWastageByItemIdPublic(itemId) {
  try {
    const response = await axios.get(
      `${WASTAGE_BACKEND_URL}/api/wastage/all/${itemId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching wastage records by item id:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch wastage records by item id.");
  }
}

/**
 * Get item details by item ID (public endpoint, no token required).
 * @param {string} itemId - The ID of the item.
 * @returns {object} - The item details.
 */
async function getItemById(itemId) {
  try {
    const response = await axios.get(
      `${ITEM_BACKEND_URL}/api/items/by-id/${itemId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching item by id:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch item by id.");
  }
}

module.exports = {
  validateItem,
  updateUserItem,
  updatePackagingMetrics,
  addWastage,
  getWastageByItemIdPublic,
  getItemById,
};
