const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // Debugging

  if (!token) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded User:", verified); // Debugging
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token Error:", err.message); // Debugging
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateToken;
