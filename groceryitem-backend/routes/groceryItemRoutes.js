const express = require("express");
const {
  createGroceryItem,
  getAllGroceryItems,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  getAllUserGroceries,
} = require("../controllers/groceryItemController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Apply the middleware to routes that require authentication
router.post("/", authenticateToken, createGroceryItem);
// router.get("/", authenticateToken, getAllGroceryItems);
router.get("/", authenticateToken, getAllUserGroceries);

router.get("/:id", authenticateToken, getGroceryItemById);
router.put("/:id", authenticateToken, updateGroceryItem);
router.delete("/:id", authenticateToken, deleteGroceryItem);

module.exports = router;
