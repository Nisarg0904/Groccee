const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authMiddleware");
const sendEmail = require("../services/emailService"); // Import the email service

// 1. Send Verification Email
router.post("/send-verification-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const subject = "Email Verification";
    const text = `Click on the link to verify your email: ${verificationUrl}`;
    const htmlMessage = `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

    await sendEmail(email, subject, text, htmlMessage);
    res.status(200).json({ message: "Verification email sent successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
});

// 2. Verify Email
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// 3. Send Password Reset Email
router.post("/send-password-reset", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = "Password Reset";
    const text = `Click on the link to reset your password: ${resetUrl}`;
    const htmlMessage = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    await sendEmail(email, subject, text, htmlMessage);
    res
      .status(200)
      .json({ message: "Password reset email sent successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error sending email", error: err.message });
  }
});

// 4. Reset Password
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetToken !== token || user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10); // Hash new password
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// 5. Resend Verification Email
router.post("/resend-verification-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "This email is already verified." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const subject = "Email Verification";
    const text = `Click on the link to verify your email: ${verificationUrl}`;
    const htmlMessage = `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`;

    await sendEmail(email, subject, text, htmlMessage);
    res.status(200).json({ message: "Verification email sent successfully." });
  } catch (err) {
    res.status(500).json({
      message: "Error resending verification email",
      error: err.message,
    });
  }
});

// 5. Signup
router.post("/signup", async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one digit, and one special character.",
      });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already in use" });
    }

    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.errors
        ? err.errors[0].message
        : "Server error during signup",
    });
  }
});

// 6. Login
router.post("/login", async (req, res) => {
  const { input, password } = req.body;

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const user = isEmail
      ? await User.findOne({ where: { email: input } })
      : await User.findOne({ where: { username: input } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.header("Authorization", `Bearer ${token}`).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
});

// 7. Get User Info
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error fetching profile" });
  }
});

// Define a route to update user details
router.put("/edit", authenticateToken, async (req, res) => {
  const userId = req.user.id; // Extract the authenticated user ID from the token
  const { firstName, lastName, shoppingActivity, dietPreference, cuisinePreference, cookingForPeople } = req.body;

  try {
    // Update the user details in the database
    const updatedUser = await User.update(
      { firstName, lastName, shoppingActivity, dietPreference, cuisinePreference, cookingForPeople },
      { where: { id: userId }, returning: true }
    );

    if (!updatedUser[0]) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser[1][0]); // Return the updated user details
  } catch (error) {
    console.error("Error updating user details:", error.message);
    res.status(500).json({ message: "Failed to update user details" });
  }
});


module.exports = router;
