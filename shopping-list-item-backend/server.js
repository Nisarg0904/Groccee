const express = require("express");
const shoppingListItemRoutes = require("./routes/shoppingListItemRoutes");
const { spawn } = require("child_process");
const path = require("path");

// Import the initialized Sequelize instance from models
const { sequelize } = require("./models");

// Synchronize the database
(async () => {
  try {
    await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables if needed
    console.log("Database synchronized, tables created if they didn't exist.");
  } catch (error) {
    console.error("Error synchronizing database:", error.message);
  }
})();

const app = express();
app.use(express.json());

// Start Python service for generating shopping list items on port 6003
const pythonServicePath = path.join(
  __dirname,
  "python-service",
  "generate_shopping_list_items.py"
);
const pythonProcess = spawn("python", [pythonServicePath], {
  env: { ...process.env, PORT: "6000" }, // Override the PORT for the Python process
});

// Log Python process output
pythonProcess.stdout.on("data", (data) => {
  console.log(`Python shopping list service: ${data}`);
});
pythonProcess.stderr.on("data", (data) => {
  console.error(`Python shopping list service error: ${data}`);
});
pythonProcess.on("close", (code) => {
  console.log(`Python shopping list service exited with code ${code}`);
  // Restart the service if it crashes unexpectedly
  if (code !== 0 && !app.isShuttingDown) {
    console.log("Restarting Python shopping list service...");
    setTimeout(() => {
      const newPythonProcess = spawn("python", [pythonServicePath], {
        env: { ...process.env, PORT: "6003" },
      });
      newPythonProcess.stdout.pipe(process.stdout);
      newPythonProcess.stderr.pipe(process.stderr);
    }, 3000); // Wait 3 seconds before restarting
  }
});

// Track shutdown state for graceful exit
app.isShuttingDown = false;
process.on("SIGINT", () => {
  console.log("Shutting down...");
  app.isShuttingDown = true;
  pythonProcess.kill();
  process.exit(0);
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Healthy" });
});

// API routes for shopping list items
app.use("/api/shopping-list-items", shoppingListItemRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Shopping List Item Service running on port ${PORT}`);
  console.log(
    `Python shopping list service started with file: generate_shopping_list_items.py`
  );
});
