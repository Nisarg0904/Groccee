require('dotenv').config();

const express = require("express");
const wastageDB = require("./config/wastage_db");  
const wastageRoutes = require("./routes/wastageRoutes");
const publicWastageRoutes= require("./routes/publicWastageRoutes");
const cron = require("node-cron");
// Import the function
const moveExpiredItemsToWastage = require("./utils/trackExpiry");

const app = express();

// Middleware
app.use(express.json());

// Schedule the task to run daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled job to move expired items to wastage...");
  try {
    await moveExpiredItemsToWastage();
    console.log("✅ Successfully moved expired items to wastage");
  } catch (error) {
    console.error("❌ Error in scheduled job:", error);
  }
});

// Test the database connection
wastageDB
  .authenticate()
  .then(() => console.log("Connected to wastage database"))
  .catch((error) =>
    console.error("Unable to connect to wastage database:", error)
  );

wastageDB
  .sync({ alter: true }) // Ensure it adapts to your changes
  .then(() => console.log("✅ Wastage table synced"))
  .catch((err) => console.error("❌ Error syncing Wastage table:", err));

wastageDB.options.logging = console.log;
app.use("/api/wastage", publicWastageRoutes);

// Routes
app.use("/api/wastage", wastageRoutes);

// Add a route to manually trigger the expiry check (useful for testing)
app.post("/api/check-expired", async (req, res) => {
  try {
    console.log("Manual expiry check triggered");
    await moveExpiredItemsToWastage();
    res.status(200).json({ message: "Expiry check completed successfully" });
  } catch (error) {
    console.error("Error in manual expiry check:", error);
    res.status(500).json({ message: "Failed to check expired items", error: error.message });
  }
});

// Basic route
app.get("/", (req, res) => {
  res.send("Wastage Service is Running");
});

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});