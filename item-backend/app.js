const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const itemRoutes = require("./routes/itemRoutes"); // Import item routes

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(express.json()); // Replaces bodyParser.json()

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log("✅ MongoDB connected");
})
.catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/items", itemRoutes);

app.get("/", (req, res) => {
    res.send("Item Service is running! ✅");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
