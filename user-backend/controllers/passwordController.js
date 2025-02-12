const bcrypt = require("bcrypt");
const User = require("../models/user");
const sendEmail = require("../services/emailService");

// Utility function to generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ✅ **Send Password Reset OTP**
exports.sendPasswordResetOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a **6-digit OTP**
    const otp = generateOTP();
    console.log("Generated OTP:", otp); // ✅ Debugging

    // Save OTP & expiry in the database
    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    // Send OTP email
    const subject = "Password Reset Code";
    const text = `Your password reset code is: ${otp}`;
    const htmlMessage = `<p>Your password reset code is: <strong>${otp}</strong></p><p>This code is valid for 10 minutes.</p>`;

    await sendEmail(email, subject, text, htmlMessage);

    res.status(200).json({ message: "Password reset OTP sent successfully." });
  } catch (err) {
    console.error("Error sending OTP email:", err.message);
    res
      .status(500)
      .json({ message: "Error sending OTP email", error: err.message });
  }
};

// ✅ **Verify OTP**
exports.verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Stored OTP:", user.resetToken); // ✅ Debugging
    console.log("Received OTP:", otp);

    if (!user.resetToken || user.resetTokenExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Request a new one." });
    }

    if (user.resetToken !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    res
      .status(200)
      .json({ message: "OTP verified. Proceed to reset password." });
  } catch (err) {
    console.error("Error verifying OTP:", err.message);
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: err.message });
  }
};

// ✅ **Reset Password**
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // **Ensure OTP was previously verified**
    if (!user.resetToken || user.resetTokenExpiry < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP expired or not verified. Request a new one." });
    }

    // ✅ **Just set the new password (beforeUpdate will hash it automatically)**
    user.password = newPassword;

    // ✅ Clear OTP after successful password reset
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save(); // `beforeUpdate` will hash the password

    res
      .status(200)
      .json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Error resetting password:", err.message);
    res
      .status(500)
      .json({ message: "Error resetting password", error: err.message });
  }
};

