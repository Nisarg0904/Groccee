// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "Access Denied" });

  // Extract the token part after "Bearer"
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Token" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authenticateToken;
