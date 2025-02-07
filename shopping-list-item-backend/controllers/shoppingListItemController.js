const ShoppingListItem = require("../models/shoppingListItem");
const { validateShoppingList, validateOrFetchItem } = require("../utils/apiHelper"); // Import helper functions


/**
 * Create a Shopping List Item (Validates Shopping List & Item First)
 */
const createShoppingListItem = async (req, res) => {
  try {
    const { shopping_list_id, name, unit, quantity, price } = req.body;
    const token = req.header("Authorization"); // Get user token for API calls

    if (!shopping_list_id || !name) {
      return res.status(400).json({ message: "Shopping list ID and item name are required" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(shopping_list_id, token);
    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found or does not belong to the user" });
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
    const shoppingListItem = await ShoppingListItem.findOne({ where: { list_item_id: id } });

    if (!shoppingListItem) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(shoppingListItem.shopping_list_id, token);
    if (!shoppingList) {
      return res.status(403).json({ message: "You are not authorized to update this item" });
    }

    // ✅ Update the item fields
    await shoppingListItem.update({
      name: name || shoppingListItem.name,
      unit: unit || shoppingListItem.unit,
      quantity: quantity !== undefined ? quantity : shoppingListItem.quantity,
      price: price !== undefined ? price : shoppingListItem.price,
      bought: bought !== undefined ? bought : shoppingListItem.bought,
    });

    res.status(200).json({ message: "Shopping list item updated successfully", shoppingListItem });
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
    const shoppingListItem = await ShoppingListItem.findOne({ where: { list_item_id: id } });

    if (!shoppingListItem) {
      return res.status(404).json({ message: "Shopping list item not found" });
    }

    // Validate if the Shopping List exists & belongs to the user
    const shoppingList = await validateShoppingList(shoppingListItem.shopping_list_id, token);
    if (!shoppingList) {
      return res.status(403).json({ message: "You are not authorized to delete this item" });
    }

    // Delete the item
    await shoppingListItem.destroy();

    res.status(200).json({ message: "Shopping list item deleted successfully" });
  } catch (error) {
    console.error("Error deleting shopping list item:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createShoppingListItem,
  updateShoppingListItem,
  // getShoppingListItemsByName,
  deleteShoppingListItem,
};
