const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const SuggestedItem = require("../models/SuggestedItem");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Load JSON file
const seedFilePath = path.join(__dirname, "../data/grocery_items_seed.json");
const seedData = JSON.parse(fs.readFileSync(seedFilePath, "utf8"));

// Format Data for MongoDB
const formattedItems = seedData.map(item => ({
    name: item.name,
    category: item.category,
    preferred_unit: item.units.length > 0 ? item.units[0] : null, // First unit as preferred
    units: item.units // Store all available units
}));

// Insert Data into MongoDB
async function seedDatabase() {
    try {
        for (const item of formattedItems) {
            const existingItem = await SuggestedItem.findOne({ name: item.name });
            if (!existingItem) {
                await SuggestedItem.create(item);
            }
        }
        console.log("Seeder data inserted successfully (No duplicates)!");
        mongoose.disconnect();
    } catch (error) {
        console.error("Error inserting seeder data:", error);
        mongoose.disconnect();
    }
}


module.exports = seedDatabase
