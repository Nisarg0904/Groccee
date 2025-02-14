const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController");

// ✅ Ensure controller functions are correctly imported
if (
  !passwordController.sendPasswordResetOTP ||
  !passwordController.verifyResetOTP ||
  !passwordController.resetPassword
) {
  throw new Error(
    "PasswordController functions are undefined. Check the import."
  );
}

// Password reset routes
router.post("/send-password-reset", passwordController.sendPasswordResetOTP);
router.post("/verify-reset-otp", passwordController.verifyResetOTP);
router.put("/reset-password", passwordController.resetPassword);

module.exports = router;
