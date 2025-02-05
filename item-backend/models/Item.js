const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Passed from user input
    category: { type: String, required: true }, // Passed from user input
    user_id: { type: Number, required: true }, // User from authentication
    packaging: [
        {
            unit: { type: String, required: true }, // Packaging unit (e.g., "liters", "cartons")
            times_bought: { type: Number, default: 0 }, // Tracks how often item is bought
            times_wasted: { type: Number, default: 0 }  // Tracks how often item is wasted
        }
    ]
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;