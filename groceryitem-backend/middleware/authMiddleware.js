const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token); // Debugging
  console.log("JWT Secret:", process.env.JWT_SECRET); // Log the secret (remove in production)

  if (!token) {
    return res.status(401).json({ message: "Invalid Token" });
  }

  try {
    console.log("Attempting to verify token with secret:", process.env.JWT_SECRET);
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified successfully:", verified); // Debugging
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token Error:", err.message, err.name); // Enhanced error logging
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateToken;