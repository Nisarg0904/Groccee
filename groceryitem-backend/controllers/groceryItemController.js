const GroceryItem = require("../models/grocery_item");
const {
  validateItem,
  addItemToDefaultShoppingList,
} = require("../utils/apiHelper");



async function createGroceryItem(req, res) {
  const {
    item_identifier,
    purchased_price,
    purchased_on,
    expiry_date,
    purchased_quantity,
    available_quantity,
    packaging,
  } = req.body;

  try {
    const token = req.header("Authorization").split(" ")[1]; // Extract token from header

    // Validate or create the item
    const item = await validateItem(item_identifier, packaging, token);

    if (!item || !item._id) {
      throw new Error("Invalid item returned from validation");
    }

    // Create a grocery item
    const groceryItem = await GroceryItem.create({
      item_id: item._id,
      purchased_price,
      purchased_on,
      expiry_date,
      purchased_quantity,
      available_quantity: available_quantity || purchased_quantity, // Default to purchased_quantity
      packaging,
      user_id: req.user.id,
    });

    // Add the item to the default shopping list
    await addItemToDefaultShoppingList(
      item._id,
      purchased_quantity,
      purchased_price,
      token
    );

    res.status(201).json({
      groceryItem,
      message: "Grocery item created and added to the default shopping list.",
    });
  } catch (error) {
    console.error("Error adding grocery item:", error.message);
    res.status(400).json({ message: error.message });
  }
}


// Get all grocery items
async function getAllGroceryItems(req, res) {
  try {
    const groceryItems = await GroceryItem.findAll({
      where: { user_id: req.user.id },
    });

    res.status(200).json(groceryItems);
  } catch (error) {
    console.error("Error fetching grocery items:", error.message);
    res.status(500).json({ message: "Failed to fetch grocery items" });
  }
}

// Get all grocery items for the authenticated user
async function getAllUserGroceries(req, res) {
  try {
    const groceryItems = await GroceryItem.findAll({
      where: { user_id: req.user.id }, // Fetch items specific to the user
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
async function updateGroceryItem(req, res) {
  const { id } = req.params; // Grocery item ID
  const { available_quantity, expiry_date, purchased_price } = req.body; // Fields to update

  try {
    const user_id = req.user.id; // Get user ID from token

    if (!available_quantity && !expiry_date && !purchased_price) {
      return res
        .status(400)
        .json({ message: "Please provide fields to update." });
    }

    const updatePayload = {};
    if (available_quantity !== undefined)
      updatePayload.available_quantity = available_quantity;
    if (expiry_date !== undefined) updatePayload.expiry_date = expiry_date;
    if (purchased_price !== undefined)
      updatePayload.purchased_price = purchased_price;

    // Update the grocery item for the authenticated user
    const updated = await GroceryItem.update(updatePayload, {
      where: {
        grocery_item_id: id,
        user_id: user_id, // Ensure the user owns the item
      },
    });

    if (!updated[0]) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.status(200).json({ message: "Grocery item updated successfully" });
  } catch (error) {
    console.error("Error updating grocery item:", error.message);
    res.status(500).json({ message: "Failed to update grocery item" });
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
  getAllUserGroceries,
};
