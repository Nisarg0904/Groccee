const { ShoppingListItem } = require("../models");
const {
  validateShoppingList,
  validateOrFetchItem,
  createShoppingList,
  getUserPreferences,
  getGroceriesByStatus,
} = require("../utils/apiHelper"); // Import helper functions
const axios = require("axios");
const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:6000";
require("dotenv").config();

/**
 * Create a Shopping List Item (Validates Shopping List & Item First)
 */
const createShoppingListItem = async (req, res) => {
  try {
    const { shopping_list_id, name, unit, quantity, price } = req.body;
    const token = req.header("Authorization"); // Get user token for API calls

    if (!shopping_list_id || !name) {
      return res
        .status(400)
        .json({ message: "Shopping list ID and item name are required" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(shopping_list_id, token);
    if (!shoppingList) {
      return res.status(404).json({
        message: "Shopping list not found or does not belong to the user",
      });
    }

    // Check if the item exists in MongoDB's Item Table
    const existingItem = await validateOrFetchItem(name, token);
    const item_id = existingItem ? existingItem._id : null; // If item exists, use its ID; otherwise, keep it null

    // Create the shopping list item in PostgreSQL
    const shoppingListItem = await ShoppingListItem.create({
      shopping_list_id,
      name,
      unit,
      quantity,
      price,
      item_id, // This will be null if the item doesn't exist
    });

    res.status(201).json(shoppingListItem);
  } catch (error) {
    console.error("Error creating shopping list item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const getShoppingListItemsByName = async (req, res) => {
//   try {
//     const { name } = req.params; // Get shopping list name from URL params
//     const token = req.header("Authorization"); // Get user token for validation

//     if (!name) {
//       return res.status(400).json({ message: "Shopping list name is required" });
//     }

//     // ✅ Fetch shopping list by name using helper function
//     const shoppingList = await fetchShoppingListByName(name, token);

//     if (!shoppingList) {
//       return res.status(404).json({ message: "Shopping list not found" });
//     }

//     // ✅ Fetch all shopping list items for the found shopping list
//     const shoppingListItems = await ShoppingListItem.findAll({
//       where: { shopping_list_id: shoppingList.shopping_list_id },
//     });

//     res.status(200).json(shoppingListItems);
//   } catch (error) {
//     console.error("Error fetching shopping list items by name:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const updateShoppingListItem = async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from URL params
    const { name, unit, quantity, price, bought } = req.body; // Fields to update
    const token = req.header("Authorization"); // Get user token for validation

    // Check if the shopping list item exists
    const shoppingListItem = await ShoppingListItem.findOne({
      where: { list_item_id: id },
    });

    if (!shoppingListItem) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(
      shoppingListItem.shopping_list_id,
      token
    );
    if (!shoppingList) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this item" });
    }

    // ✅ Update the item fields
    await shoppingListItem.update({
      name: name || shoppingListItem.name,
      unit: unit || shoppingListItem.unit,
      quantity: quantity !== undefined ? quantity : shoppingListItem.quantity,
      price: price !== undefined ? price : shoppingListItem.price,
      bought: bought !== undefined ? bought : shoppingListItem.bought,
    });

    res.status(200).json({
      message: "Shopping list item updated successfully",
      shoppingListItem,
    });
  } catch (error) {
    console.error("Error updating shopping list item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete a Shopping List Item
 */
const deleteShoppingListItem = async (req, res) => {
  try {
    const { id } = req.params; // Get item ID from URL params
    const token = req.header("Authorization"); // Get user token for validation

    // Check if the shopping list item exists
    const shoppingListItem = await ShoppingListItem.findOne({
      where: { list_item_id: id },
    });

    if (!shoppingListItem) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(
      shoppingListItem.shopping_list_id,
      token
    );
    if (!shoppingList) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this item" });
    }

    // Delete the item
    await shoppingListItem.destroy();

    res
      .status(200)
      .json({ message: "Shopping list item deleted successfully" });
  } catch (error) {
    console.error("Error deleting shopping list item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all Shopping List Items by Shopping List ID
 */
const getItemsByShoppingListId = async (req, res) => {
  try {
    const { shopping_list_id } = req.params; // Get shopping list ID from URL params
    const token = req.header("Authorization");

    if (!shopping_list_id) {
      return res.status(400).json({ message: "Shopping list ID is required" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(shopping_list_id, token);
    if (!shoppingList) {
      return res.status(404).json({
        message: "Shopping list not found or does not belong to the user",
      });
    }

    // Fetch all items for this shopping list
    const items = await ShoppingListItem.findAll({
      where: { shopping_list_id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching shopping list items:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Generate a shopping list for the user by:
 * - Fetching available groceries (active and expiring)
 * - Fetching user preferences
 * - Creating a new shopping list (with a default name)
 * - Sending these data to the ML suggestion service
 * - Saving each suggested shopping list item in the database
 */
const generateShoppingListForUser = async (req, res) => {
  try {
    const token = req.header("Authorization");
    // Assuming the authenticated user's ID is available in req.user.id
    const user_id = req.user.id;
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch available groceries by status: "active" and "expiring"
    const activeGroceries = await getGroceriesByStatus("active", token);
    const expiringGroceries = await getGroceriesByStatus("expiring", token);

    // Merge available groceries and remove duplicates by item_id
    let availableGroceries = [];
    const groceryMap = {};
    [activeGroceries, expiringGroceries].forEach((groceriesArray) => {
      if (groceriesArray && Array.isArray(groceriesArray)) {
        groceriesArray.forEach((item) => {
          if (!groceryMap[item.item_id]) {
            groceryMap[item.item_id] = item;
          }
        });
      }
    });
    availableGroceries = Object.values(groceryMap);

    // Fetch user preferences for the given user
    const userPreferences = await getUserPreferences(user_id, token);

    // Create a new shopping list with a default name that includes the current date/time
    const shoppingListData = {
      name: "Shopping List - " + new Date().toLocaleString(),
    };
    const newShoppingList = await createShoppingList(shoppingListData, token);
    if (!newShoppingList) {
      return res
        .status(500)
        .json({ message: "Failed to create shopping list" });
    }

    // Build payload for the ML suggestion service
    const mlPayload = {
      shopping_list_id: newShoppingList.shopping_list_id,
      availableGroceries,
      userPreferences,
    };

    // Call the ML service to get shopping list item suggestions.
    // This endpoint should be the one we created in our ML service.
    const mlResponse = await axios.post(
      `${mlServiceUrl}/suggest_shopping_list`,
      mlPayload
    );
    const suggestions = mlResponse.data;

    // Create each suggested shopping list item in the database.
    const createdItems = [];
    for (const suggestion of suggestions) {
      const newItem = await ShoppingListItem.create({
        shopping_list_id: suggestion.shopping_list_id,
        name: suggestion.name,
        unit: suggestion.unit,
        quantity: suggestion.quantity,
        price: null, // Price is not determined at suggestion time.
        // Optionally, you can set item_id if available.
      });
      createdItems.push(newItem);
    }

    return res.status(201).json({
      message: "Shopping list generated successfully",
      shoppingList: newShoppingList,
      items: createdItems,
    });
  } catch (error) {
    console.error("Error generating shopping list:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  createShoppingListItem,
  updateShoppingListItem,
  getItemsByShoppingListId,
  deleteShoppingListItem,
  generateShoppingListForUser,
};
