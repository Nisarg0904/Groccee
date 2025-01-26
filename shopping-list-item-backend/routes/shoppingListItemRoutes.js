const express = require("express");
const authenticateToken = require("../middleware/authMiddleware");

const {
  createShoppingListItem,
  addItemToDefaultShoppingList,
  getItemsInShoppingList,
  updateShoppingListItem,
  deleteShoppingListItem,
} = require("../controllers/shoppingListItemController");

const router = express.Router();

router.post("/", authenticateToken, createShoppingListItem);
router.post("/default", authenticateToken, addItemToDefaultShoppingList);
router.get("/:shopping_list_id", authenticateToken, getItemsInShoppingList);
router.put("/:list_item_id", authenticateToken, updateShoppingListItem);
router.delete("/:list_item_id", authenticateToken, deleteShoppingListItem);

module.exports = router;
