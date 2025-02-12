const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// ✅ Ensure controller functions are correctly imported
if (!emailController.sendVerificationEmail || !emailController.verifyEmail) {
  throw new Error("EmailController functions are undefined. Check the import.");
}

// Email verification routes
router.post("/send-verification-email", emailController.sendVerificationEmail);
router.get("/verify-email", emailController.verifyEmail);

module.exports = router;
