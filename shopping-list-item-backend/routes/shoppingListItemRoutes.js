const express = require("express");
const router = express.Router();
// const authenticateToken = require("../middleware/authMiddleware");
const { createShoppingListItem, deleteShoppingListItem, updateShoppingListItem,  } = require("../controllers/shoppingListItemController");

// ✅ Create a Shopping List Item (Validates Shopping List & Item First)
router.delete("/:id",  deleteShoppingListItem);
router.post("/",createShoppingListItem);
// router.get("/by-name/:name",  getShoppingListItemsByName);
router.put("/:id", updateShoppingListItem);

module.exports = router;
