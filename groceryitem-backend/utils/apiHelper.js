const axios = require("axios");

const USER_BACKEND_URL =
  process.env.USER_BACKEND_URL || "http://localhost:5000";
const ITEM_BACKEND_URL =
  process.env.ITEM_BACKEND_URL || "http://localhost:5006";
const SHOPPING_LIST_BACKEND_URL =
  process.env.SHOPPING_LIST_BACKEND_URL || "http://localhost:5002";



// Validate or fetch an item by name or ID
async function validateItem(itemIdentifier, packaging, token) {
  try {
    let response;

    // Fetch the item by name or ID
    if (itemIdentifier.match(/^[0-9a-fA-F]{24}$/)) {
      response = await axios.get(
        `${ITEM_BACKEND_URL}/api/items/${itemIdentifier}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      response = await axios.get(
        `${ITEM_BACKEND_URL}/api/items/by-name/${itemIdentifier.toLowerCase()}`, // Convert name to lowercase for consistency
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    if (response.status === 200) {
      const item = response.data;

      // Check if the packaging exists
      const packagingExists = item.default_packaging.some(
        (p) =>
          p.quantity === packaging.quantity &&
          p.unit.toLowerCase() === packaging.unit.toLowerCase()
      );

      if (!packagingExists) {
        // Add the new packaging
        item.default_packaging.push(packaging);
        const updateResponse = await axios.put(
          `${ITEM_BACKEND_URL}/api/items/${item._id}`,
          { default_packaging: item.default_packaging },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        return updateResponse.data;
      }

      return item;
    }
  } catch (error) {
    console.error("Error validating item:", error.message);

    if (error.response && error.response.status === 404) {
      console.log("Item not found, creating new item.");

      // Create the item if it does not exist
      const newItem = {
        name: itemIdentifier.toLowerCase(), // Convert name to lowercase for consistency
        unit: packaging.unit,
        price_per_unit: packaging.price,
        default_packaging: [packaging],
      };

      const createResponse = await axios.post(
        `${ITEM_BACKEND_URL}/api/items`,
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return createResponse.data;
    }

    throw new Error("Error validating item");
  }
}

// Add item to the default shopping list




module.exports = { validateUser, validateItem };
