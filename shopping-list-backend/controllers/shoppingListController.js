const ShoppingList = require("../models/shoppingListModel");


const createShoppingList = async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user.id; // Extract user_id from authenticated request

    if (!name) {
      return res.status(400).json({ message: "Shopping list name is required" });
    }

  
    const shoppingList = await ShoppingList.create({
      name,
      user_id,
    });

    res.status(201).json(shoppingList);
  } catch (error) {
    console.error("Error creating shopping list:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ Get All Shopping Lists for the Authenticated User
 */
const getAllShoppingLists = async (req, res) => {
  try {
    const user_id = req.user.id; // Extract user_id from token

    const shoppingLists = await ShoppingList.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]], // Sort by latest
    });

    res.status(200).json(shoppingLists);
  } catch (error) {
    console.error("Error fetching shopping lists:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getShoppingListById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // Ensure user only accesses their lists

    const shoppingList = await ShoppingList.findOne({
      where: { shopping_list_id: id, user_id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    console.error("Error fetching shopping list by ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * ✅ Update a Shopping List by ID
 */
const updateShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const user_id = req.user.id;

    // ✅ Validate status input
    const validStatuses = ["Pending", "Purchased"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const shoppingList = await ShoppingList.findOne({
      where: { shopping_list_id: id, user_id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    // ✅ If status is "Purchased", set `purchased_date` to NOW
    let purchased_date = shoppingList.purchased_date;
    if (status === "Purchased") {
      purchased_date = new Date(); // Set current date
    } else if (status === "Pending") {
      purchased_date = null; // Reset purchased_date if status changes back
    }

    // ✅ Update the shopping list
    await shoppingList.update({
      name: name || shoppingList.name,
      status: status || shoppingList.status,
      purchased_date: purchased_date, // Ensure purchased_date is updated
    });

    res.status(200).json({ message: "Shopping list updated", shoppingList });
  } catch (error) {
    console.error("Error updating shopping list:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getShoppingListByName = async (req, res) => {
  try {
    const { name } = req.query;
    const user_id = req.user.id; // Ensure the shopping list belongs to the authenticated user

    if (!name) {
      return res.status(400).json({ message: "Shopping list name is required" });
    }

    const shoppingList = await ShoppingList.findOne({
      where: { name, user_id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: `Shopping list '${name}' not found` });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    console.error("Error fetching shopping list by name:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * ✅ Delete a Shopping List by ID
 */
const deleteShoppingList = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // Extract user_id from token

    const shoppingList = await ShoppingList.findOne({
      where: { shopping_list_id: id, user_id },
    });

    if (!shoppingList) {
      return res.status(404).json({ message: "Shopping list not found" });
    }

    await shoppingList.destroy();
    res.status(200).json({ message: "Shopping list deleted" });
  } catch (error) {
    console.error("Error deleting shopping list:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createShoppingList,
  getAllShoppingLists,
  getShoppingListById,
  updateShoppingList,
  getShoppingListByName,
  deleteShoppingList,
};