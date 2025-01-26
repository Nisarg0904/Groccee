const ShoppingList = require("../models/shoppingListModel");

exports.createShoppingList = async (req, res) => {
  try {
    const { name, purchased } = req.body; // Extract name and purchased flag from the request body
    const user_id = req.user.id; // Extract user_id from the authenticated token

    // Prepare shopping list data
    const shoppingListData = {
      name,
      user_id,
      created_on: new Date(),
    };

    // If the list is already purchased, set purchased_on to created_on
    if (purchased) {
      shoppingListData.purchased_on = shoppingListData.created_on;
      shoppingListData.status = "bought";
    }

    // Create the shopping list
    const shoppingList = await ShoppingList.create(shoppingListData);

    res.status(201).json(shoppingList);
  } catch (error) {
    console.error("Error creating shopping list:", error.message);
    res.status(500).json({ error: error.message });
  }
};
// Get all shopping lists
exports.getAllShoppingLists = async (req, res) => {
  try {
    const shoppingLists = await ShoppingList.findAll();
    res.status(200).json(shoppingLists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific shopping list by ID
exports.getShoppingListById = async (req, res) => {
  try {
    const { list_id } = req.params;
    const shoppingList = await ShoppingList.findByPk(list_id);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a shopping list
exports.updateShoppingList = async (req, res) => {
  try {
    const { list_id } = req.params;
    const { name, status } = req.body;

    const shoppingList = await ShoppingList.findByPk(list_id);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    shoppingList.name = name || shoppingList.name;
    shoppingList.status = status || shoppingList.status;

    await shoppingList.save();

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a shopping list
exports.deleteShoppingList = async (req, res) => {
  try {
    const { list_id } = req.params;

    const shoppingList = await ShoppingList.findByPk(list_id);

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    await shoppingList.destroy();
    res.status(200).json({ message: "Shopping list deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShoppingListByNameAndUser = async (req, res) => {
  try {
    const { name } = req.query; // Only name is passed in the query parameters
    const user_id = req.user.id; // Extract user_id from the token (set by authenticateToken)

    // Validate that the name is provided
    if (!name) {
      return res
        .status(400)
        .json({ message: "Shopping list name is required" });
    }

    // Find shopping lists by name and user_id
    const shoppingLists = await ShoppingList.findAll({
      where: { name, user_id },
    });

    if (!shoppingLists || shoppingLists.length === 0) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    res.status(200).json(shoppingLists);
  } catch (error) {
    console.error("Error fetching shopping list:", error.message);
    res.status(500).json({ error: error.message });
  }
};

