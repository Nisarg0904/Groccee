const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const { createShoppingList,
  getAllShoppingLists,
  updateShoppingList,
  deleteShoppingList,
 } = require("../controllers/shoppingListController");

// Route to Create a Shopping List
router.post("/", authenticateToken, createShoppingList);
// Get all shopping lists for the authenticated user
router.get("/", authenticateToken, getAllShoppingLists);

// Update a shopping list by ID (allow updating status)
router.put("/:id", authenticateToken, updateShoppingList);

// Delete a shopping list by ID
router.delete("/:id", authenticateToken, deleteShoppingList);

module.exports = router;
