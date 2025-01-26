const express = require("express");
const authenticateToken = require("../middleware/authMiddleware"); // Import middleware

const {
  createShoppingList,
  getAllShoppingLists,
  getShoppingListById,
  updateShoppingList,
  deleteShoppingList,
  getShoppingListByNameAndUser,
} = require("../controllers/shoppingListController");

const router = express.Router();

// 6. Get shopping list by name and user (requires authentication)
router.get("/search", authenticateToken, getShoppingListByNameAndUser);

// 1. Create a new shopping list (requires authentication)
router.post("/", authenticateToken, createShoppingList);

// 2. Get all shopping lists (requires authentication)
router.get("/", authenticateToken, getAllShoppingLists);

// 3. Get a specific shopping list by ID (requires authentication)
router.get("/:list_id", authenticateToken, getShoppingListById);

// 4. Update a shopping list (e.g., change name or status) (requires authentication)
router.put("/:list_id", authenticateToken, updateShoppingList);

// 5. Delete a shopping list (requires authentication)
router.delete("/:list_id", authenticateToken, deleteShoppingList);

module.exports = router;
