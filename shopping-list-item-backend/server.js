const express = require("express");
const bodyParser = require("body-parser");
const shoppingListItemRoutes = require("./routes/shoppingListItemRoutes");
const ShoppingListItem = require("./models/shoppingListItem");

(async () => {
  try {
    await sequelize.sync({ force: false }); // Set `force: true` to drop and recreate tables
    console.log("Database synchronized, tables created if they didn't exist.");
  } catch (error) {
    console.error("Error synchronizing database:", error.message);
  }
})();

const app = express();
app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Healthy" });
});

// Define the base route for shopping list items
app.use("/api/shopping-list-items", shoppingListItemRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Shopping List Item Service running on port ${PORT}`);
});
