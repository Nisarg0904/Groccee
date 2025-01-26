require('dotenv').config();

const express = require("express");
const wastageDB = require("./config/wastage_db");  
const wastageRoutes = require("./routes/wastageRoutes");

const app = express();

// Middleware
app.use(express.json());

// Test the database connection
wastageDB
  .authenticate()
  .then(() => console.log("Connected to wastage database"))
  .catch((error) =>
    console.error("Unable to connect to wastage database:", error)
  );


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

