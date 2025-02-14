require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/user_db");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const passwordRoutes = require("./routes/passwordRoutes");

const app = express();

// ✅ Enable CORS (Allow all origins)
app.use(cors({ origin: "*" }));

// ✅ Middleware to parse JSON request bodies
app.use(express.json());

// ✅ Register Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/password", passwordRoutes);

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

// ✅ Database Connection & Server Start
const PORT = process.env.PORT || 5000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ Database connection error:", err));
