const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authMiddleware");

// ✅ Ensure controller functions are correctly imported
if (!userController.getProfile || !userController.editProfile) {
  throw new Error("UserController functions are undefined. Check the import.");
}

// User profile routes
router.get("/profile", authenticateToken, userController.getProfile);
router.put("/profile", authenticateToken, userController.editProfile);

module.exports = router;
