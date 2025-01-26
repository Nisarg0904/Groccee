
// Create a shopping list item
const ShoppingListItem = require("../models/shoppingListItemModel");
const {
  validateShoppingList,
  createShoppingList,
  validateOrFetchItem,
  createItem,
} = require("../utils/apiHelper");

exports.createShoppingListItem = async (req, res) => {
  try {
    const {
      shopping_list_id,
      item_identifier,
      quantity,
      expected_price,
      unit,
    } = req.body; // Include `unit` in the request body
    const user_id = req.user.id; // Extract user ID from token
    const token = req.header("Authorization").split(" ")[1];

    // Validate if the shopping list exists
    let shoppingList = await validateShoppingList(
      { list_id: shopping_list_id, user_id },
      token
    );

    if (!shoppingList) {
      return res.status(404).json({
        message: "Default shopping list does not exist",
      });
    }

    // Validate or fetch the item
    console.log("Validating or fetching item...");
    let item = await validateOrFetchItem(item_identifier, token);
    console.log("Item:", item);

    // If the item doesn't exist, create it
    if (!item) {
      console.log("Item not found, creating a new one...");
      item = await createItem(item_identifier, user_id, token, {
        unit: unit || "unknown", // Use the unit from the request or fallback to "unknown"
        price: 0, // Default price
      });
      console.log("Created Item:", item);
    }

    // Check if the item already exists in the shopping list
    const existingListItem = await ShoppingListItem.findOne({
      where: { shopping_list_id: shoppingList.list_id, item_id: item._id },
    });

    if (existingListItem) {
      // Update the existing item's quantity and price
      existingListItem.quantity += quantity;
      if (expected_price !== undefined) {
        existingListItem.expected_price = expected_price;
      }
      await existingListItem.save();
      return res
        .status(200)
        .json({ message: "Item updated in shopping list", existingListItem });
    }

    // Add a new item to the shopping list
    const newItem = await ShoppingListItem.create({
      shopping_list_id: shoppingList.list_id,
      item_id: item._id, // Use the new or fetched item's ID
      quantity,
      expected_price,
    });

    res.status(201).json({ message: "Item added to shopping list", newItem });
  } catch (error) {
    console.error("Error creating shopping list item:", error.message);
    res.status(500).json({ error: error.message });
  }
};





exports.addItemToDefaultShoppingList = async (req, res) => {
  try {
    const { item_identifier, quantity, actual_price } = req.body;
    const user_id = req.user.id; // Extract user ID from token
    const token = req.header("Authorization").split(" ")[1];

    // Generate today's default shopping list name
    const today = new Date().toISOString().split("T")[0];
    const defaultListName = `Default List - ${today}`;

    // Validate or create the default shopping list
    console.log("Validating or creating shopping list...");
    let shoppingList = await validateShoppingList(
      { name: defaultListName, user_id },
      token
    );

    console.log("Shopping List:", shoppingList);

    // Handle shopping list structure
    const shoppingListEntry = Array.isArray(shoppingList)
      ? shoppingList[0]
      : shoppingList;

    if (!shoppingListEntry || !shoppingListEntry.list_id) {
      // Create a new shopping list if none exists
      shoppingList = await createShoppingList(
        defaultListName,
        user_id,
        token,
        true // Mark the list as bought
      );
      console.log("Created Shopping List:", shoppingList);

      if (!shoppingList || !shoppingList.list_id) {
        throw new Error("Shopping list creation or retrieval failed");
      }
    }

    // Extract the list ID
    const listId = shoppingListEntry?.list_id || shoppingList?.list_id;

    // Validate or create the item
    console.log("Validating or fetching item...");
    const item = await validateOrFetchItem(item_identifier, token);
    console.log("Item:", item);

    if (!item) {
      return res
        .status(400)
        .json({ message: "Item validation or creation failed" });
    }

    // Add the item to the default shopping list (always as a new entry)
    const newItem = await ShoppingListItem.create({
      shopping_list_id: listId,
      item_id: item._id,
      quantity,
      expected_price: null, // Set expected_price to null
      actual_price, // Use the price passed by the user
    });

    console.log("Created Shopping List Item:", newItem);

    res
      .status(201)
      .json({ message: "Item added to default shopping list", newItem });
  } catch (error) {
    console.error("Error adding item to default shopping list:", error.message);
    res.status(500).json({ error: error.message });
  }
};





// Get all items in a shopping list
exports.getItemsInShoppingList = async (req, res) => {
  try {
    const { shopping_list_id } = req.params;

    const items = await ShoppingListItem.findAll({
      where: { shopping_list_id },
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a shopping list item
exports.updateShoppingListItem = async (req, res) => {
  try {
    const { list_item_id } = req.params;
    const { quantity, expected_price, actual_price } = req.body;

    const updatedItem = await ShoppingListItem.update(
      { quantity, expected_price, actual_price },
      { where: { list_item_id }, returning: true }
    );

    res.status(200).json(updatedItem[1][0]); // returning updated object
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a shopping list item
exports.deleteShoppingListItem = async (req, res) => {
  try {
    const { list_item_id } = req.params;

    await ShoppingListItem.destroy({
      where: { list_item_id },
    });

    res
      .status(200)
      .json({ message: "Shopping list item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
