const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ✅ **Signup Controller**
exports.signup = async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "Email already in use" });

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists)
      return res.status(400).json({ message: "Username already in use" });

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
    res
      .status(500)
      .json({
        message: err.errors
          ? err.errors[0].message
          : "Server error during signup",
      });
  }
};

// ✅ **Login Controller**
exports.login = async (req, res) => {
  const { input, password } = req.body;

  try {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    const user = isEmail
      ? await User.findOne({ where: { email: input } })
      : await User.findOne({ where: { username: input } });

    if (!user) return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Wrong password!" });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in." });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.header("Authorization", `Bearer ${token}`).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error during login" });
  }
};
