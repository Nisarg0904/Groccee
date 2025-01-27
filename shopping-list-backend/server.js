const express = require("express");
const { connectDB } = require("./config/db");
const ShoppingList = require("./models/shoppingListModel");
const shoppingListRoutes = require("./routes/shoppingListRoutes");

const app = express();
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Healthy" });
});

// Use the shopping list routes
app.use("/api/shopping-lists", shoppingListRoutes);

// Connect to the database
connectDB();

// Sync models to the database
(async () => {
  try {
    await ShoppingList.sync(); // Use migrations for production
    console.log("ShoppingList table synchronized successfully!");
  } catch (error) {
    console.error("Error synchronizing the ShoppingList table:", error.message);
  }
})();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Shopping List Service running on port ${PORT}`);
});
