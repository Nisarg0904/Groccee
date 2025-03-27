const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

// const authenticateToken = require("../middleware/authMiddleware");
const {
  createShoppingListItem,
  deleteShoppingListItem,
  updateShoppingListItem,
  getItemsByShoppingListId,
  generateShoppingListForUser, // New function added here
} = require("../controllers/shoppingListItemController");

// Routes for shopping list items
router.get("/list/:shopping_list_id", getItemsByShoppingListId);
router.delete("/:id", deleteShoppingListItem);
router.post("/", createShoppingListItem);
router.put("/:id", updateShoppingListItem);

// New route to generate shopping list using ML suggestions
router.post("/generate", authenticateToken, generateShoppingListForUser);

module.exports = router;
