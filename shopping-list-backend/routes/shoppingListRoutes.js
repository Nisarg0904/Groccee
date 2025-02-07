const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { createShoppingList,
  getAllShoppingLists,
  getShoppingListById,
  updateShoppingList,
  deleteShoppingList,
  getShoppingListByName,
 } = require("../controllers/shoppingListController");

// Route to Create a Shopping List
router.post("/", authenticateToken, createShoppingList);
// Get shopping list by name (Query Parameter)
router.get("/search", authenticateToken, getShoppingListByName);
// Get shopping list by ID
router.get("/:id", authenticateToken, getShoppingListById);
// Get all shopping lists for the authenticated user
router.get("/", authenticateToken, getAllShoppingLists);



// Update a shopping list by ID (allow updating status)
router.put("/:id", authenticateToken, updateShoppingList);

// Delete a shopping list by ID
router.delete("/:id", authenticateToken, deleteShoppingList);

module.exports = router;
