const User = require("../models/user");
const sendEmail = require("../services/emailService");
const jwt = require("jsonwebtoken");

// ✅ **Send Verification Email**
exports.sendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "Email is already verified" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.verificationToken = token;
    user.verificationTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const verificationUrl = `${process.env.BACKEND_URL}/api/email/verify-email?userId=${user.id}&token=${token}`;
    await sendEmail(
      email,
      "Email Verification",
      `Click to verify: ${verificationUrl}`,
      `<a href="${verificationUrl}">Verify Email</a>`
    );

    res.status(200).json({ message: "Verification email sent successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
};

// ✅ **Verify Email**
exports.verifyEmail = async (req, res) => {
  const { userId, token } = req.query;

  try {
    console.log("Received userId:", userId);
    console.log("Received token:", token);

    if (!userId || !token) {
      return res.status(400).json({ message: "Missing user ID or token" });
    }

    // Find user by ID
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Stored Token:", user.verificationToken);
    console.log("Stored Token Expiry:", user.verificationTokenExpiry);
    console.log("Current Time:", new Date());

    // Check if the token matches and is not expired
    if (user.verificationToken !== token) {
      return res.status(400).json({ message: "Invalid token" });
    }
    if (user.verificationTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Expired token" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("Error verifying email:", err.message);
    res
      .status(500)
      .json({ message: "Error verifying email", error: err.message });
  }
};
