const express = require("express");
const {
  createUserItem,
  updateUserItem,
  addOrUpdateUserItem,
  checkItemExists,
  getItemByName,
  getAllUserItems,
  updatePackagingMetrics, // ✅ New function added
} = require("../controllers/itemController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Create an item for the authenticated user (Handles Global Item check)
router.post("/", authenticateToken, createUserItem);

// ✅ Update an existing item (name, category, packaging)
router.put("/", authenticateToken, updateUserItem);

// ✅ Add or update an item (ensures correct packaging is tracked)
router.post("/add-or-update", authenticateToken, addOrUpdateUserItem);

// ✅ Get all items for the authenticated user
router.get("/", authenticateToken, getAllUserItems);

// ✅ Check if an item exists for the user
router.get("/exists", authenticateToken, checkItemExists);

// ✅ Get an item by name
router.get("/by-name/:name", authenticateToken, getItemByName);

// ✅ NEW: Update `times_bought` and `times_wasted` for a packaging unit
router.put("/update-packaging", authenticateToken, updatePackagingMetrics);

module.exports = router;
