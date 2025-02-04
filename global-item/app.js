const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const seedDatabase = require("./scripts/seedSuggestedItem"); // Import the seeder function
const suggestedItemRoutes = require("./routes/globalRoutes"); // Import routes

const app = express();
const PORT = process.env.PORT || 5010;

// Middleware
app.use(express.json()); // Replaces bodyParser.json()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log("✅ MongoDB connected");
    // await seedDatabase(); // Run seeder once when the server starts
})
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/global", suggestedItemRoutes);

app.get("/", (req, res) => {
    res.send("Global Service is running! ✅");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
