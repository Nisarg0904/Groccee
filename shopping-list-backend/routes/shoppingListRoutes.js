const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const {
  createShoppingList,
  getAllShoppingLists,
  getShoppingListById,
  updateShoppingList,
  deleteShoppingList,
  getShoppingListByNameAndUser,
  getShoppingListsByStatus, // Import the new controller function
} = require("../controllers/shoppingListController");

const router = express.Router();
// 6. Get shopping list by name and user
router.get("/search", authenticateToken, getShoppingListByNameAndUser);
// 1. Create a new shopping list
router.post("/", authenticateToken, createShoppingList);

// 2. Get all shopping lists
router.get("/", authenticateToken, getAllShoppingLists);

// 3. Get a specific shopping list by ID
router.get("/:list_id", authenticateToken, getShoppingListById);

// 4. Update a shopping list
router.put("/:list_id", authenticateToken, updateShoppingList);

// 5. Delete a shopping list
router.delete("/:list_id", authenticateToken, deleteShoppingList);

// 7. Get shopping lists by status
router.get("/status/:status", authenticateToken, getShoppingListsByStatus);

module.exports = router;
