// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    console.log('Auth Header:', authHeader); // Debugging

    if (!authHeader) {
      return res.status(401).json({ message: "Access Denied: No Authorization header" });
    }

    // Check if the header starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Access Denied: Invalid Authorization format" });
    }

    const token = authHeader.split(" ")[1];
    console.log('Extracted Token:', token); // Debugging

    if (!token) {
      return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded User:', verified); // Debugging
      req.user = verified;
      next();
    } catch (err) {
      console.error('Token Verification Error:', err.message); // Debugging
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid Token Format" });
      }
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token Expired" });
      }
      return res.status(401).json({ message: "Invalid Token" });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authenticateToken;