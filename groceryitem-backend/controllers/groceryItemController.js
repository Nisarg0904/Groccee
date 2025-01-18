const GroceryItem = require("../models/grocery_item");
const { validateUser, validateItem } = require("../utils/apiHelper");

// Create a grocery item
async function createGroceryItem(req, res) {
  const {
    item_identifier, // This could be the item_id or name
    purchased_price,
    purchased_on,
    expiry_date,
    quantity,
  } = req.body;

  try {
    // Validate or fetch the item using the identifier (id or name)
    const item = await validateItem(item_identifier);

    if (!item || !item._id) {
      throw new Error("Invalid item returned from validation");
    }

    // Create a grocery item with the referenced item_id
    const groceryItem = await GroceryItem.create({
      item_id: item._id,
      purchased_price,
      purchased_on,
      expiry_date,
      quantity,
      user_id: req.user.id, // Use the user's ID from the token
    });

    res.status(201).json(groceryItem);
  } catch (error) {
    console.error("Error adding grocery item:", error.message);
    res.status(500).json({ message: error.message });
  }
}


module.exports = { createGroceryItem };
// Get all grocery items
async function getAllGroceryItems(req, res) {
  try {
    // Fetch all grocery items for the authenticated user
    const groceryItems = await GroceryItem.findAll({
      where: { user_id: req.user.id },
    });

    res.status(200).json(groceryItems);
  } catch (error) {
    console.error("Error fetching grocery items:", error.message);
    res.status(500).json({ message: "Failed to fetch grocery items" });
  }
}

// Get a grocery item by ID
async function getGroceryItemById(req, res) {
  const { id } = req.params;

  try {
    const groceryItem = await GroceryItem.findByPk(id);

    if (!groceryItem) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.status(200).json(groceryItem);
  } catch (error) {
    console.error("Error fetching grocery item:", error.message);
    res.status(500).json({ message: "Failed to fetch grocery item" });
  }
}

// Update a grocery item
async function updateGroceryItem(req, res) {
  const { id } = req.params;
  const {
    user_id,
    item_id,
    purchased_price,
    purchased_on,
    expiry_date,
    available_quantity,
    quantity,
  } = req.body;

  try {
    // Validate the item and user if provided
    if (user_id) await validateUser(user_id);
    if (item_id) await validateItem(item_id);

    // Update the grocery item
    const updated = await GroceryItem.update(
      {
        user_id,
        item_id,
        purchased_price,
        purchased_on,
        expiry_date,
        available_quantity,
        quantity,
      },
      { where: { grocery_item_id: id } }
    );

    if (!updated[0]) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.status(200).json({ message: "Grocery item updated successfully" });
  } catch (error) {
    console.error("Error updating grocery item:", error.message);
    res.status(400).json({ message: error.message });
  }
}

// Delete a grocery item
async function deleteGroceryItem(req, res) {
  const { id } = req.params;

  try {
    const deleted = await GroceryItem.destroy({
      where: { grocery_item_id: id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.status(200).json({ message: "Grocery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting grocery item:", error.message);
    res.status(500).json({ message: "Failed to delete grocery item" });
  }
}

module.exports = {
  createGroceryItem,
  getAllGroceryItems,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
};
