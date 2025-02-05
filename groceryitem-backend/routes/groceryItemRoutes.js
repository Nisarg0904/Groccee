const express = require("express");
const {
  createGroceryItem,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  getAllUserGroceries,
  getGroceriesByStatus, // ✅ Using new function instead of getExpiredGroceryItems & getExpiringGroceryItems
} = require("../controllers/groceryItemController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create a new grocery item
router.post("/", authenticateToken, createGroceryItem);

// ✅ Get all grocery items for the authenticated user
router.get("/", authenticateToken, getAllUserGroceries);

// ✅ Get grocery items by status (expired, expiring, active, fresh)
router.get("/status", authenticateToken, getGroceriesByStatus); // 🔹 Use `?status=expired` as a query param

// ✅ Get a single grocery item by ID
router.get("/:id", authenticateToken, getGroceryItemById);

// ✅ Update a grocery item
router.put("/:id", authenticateToken, updateGroceryItem);

// ✅ Delete a grocery item
router.delete("/:id", authenticateToken, deleteGroceryItem);

module.exports = router;
