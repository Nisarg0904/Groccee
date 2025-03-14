const express = require("express");
const {
  createUserItem,
  updateUserItem,
  addOrUpdateUserItem,
  checkItemExists,
  getItemByName,
  getAllUserItems,
  updatePackagingMetrics, // ✅ New function added
  getItemById, // ✅ New function added
} = require("../controllers/itemController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Routes that require token authentication
router.post("/", authenticateToken, createUserItem);
router.put("/", authenticateToken, updateUserItem);
router.post("/add-or-update", authenticateToken, addOrUpdateUserItem);
router.get("/", authenticateToken, getAllUserItems);
router.get("/exists", authenticateToken, checkItemExists);
router.get("/by-name/:name", authenticateToken, getItemByName);
router.put("/update-packaging", authenticateToken, updatePackagingMetrics);

// Public route: Get item details by item ID (no token required)
router.get("/by-id/:id", getItemById);

module.exports = router;
