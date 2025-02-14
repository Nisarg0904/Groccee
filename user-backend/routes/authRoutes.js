const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ✅ Ensure controller functions are correctly imported
if (!authController.signup || !authController.login) {
  throw new Error("AuthController functions are undefined. Check the import.");
}

// Auth routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
