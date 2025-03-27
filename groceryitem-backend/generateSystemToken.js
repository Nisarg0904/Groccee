const jwt = require("jsonwebtoken");

// Define a payload with a system flag
const payload = {
  system: true,
  // Optionally, you can add other claims if needed
};

// Use your JWT secret (make sure to store it securely, e.g., in an environment variable)
const secret = process.env.JWT_SECRET || "your_jwt_secret";

// Sign the token with an expiration time (e.g., 30 days)
const token = jwt.sign(payload, secret, { expiresIn: "30d" });

console.log("System Token:", token);
