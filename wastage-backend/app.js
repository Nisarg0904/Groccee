require('dotenv').config();

const express = require("express");
const wastageDB = require("./config/wastage_db");  
const wastageRoutes = require("./routes/wastageRoutes");
const cron = require("node-cron");

const app = express();

// Middleware
app.use(express.json());

// Schedule the task to run daily at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled job to move expired items to wastage...");
  await moveExpiredItemsToWastage();
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


// Routes
app.use("/api/wastage", wastageRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Wastage Service is Running");
});

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

