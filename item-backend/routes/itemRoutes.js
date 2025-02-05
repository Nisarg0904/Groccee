const express = require("express");
const {
  createUserItem,
  updateUserItem,
  addOrUpdateUserItem,
  checkItemExists,
} = require("../controllers/itemController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Create an item for the authenticated user (Handles Global Item check)
router.post("/", authenticateToken, createUserItem);
router.put("/", authenticateToken, updateUserItem);
router.post("/add-or-update", authenticateToken, addOrUpdateUserItem);

router.get("/exists", authenticateToken, checkItemExists);

module.exports = router;