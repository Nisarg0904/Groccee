const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true }, // No longer unique
    category: { type: String }, // "Dairy"
    // image_url: { type: String }, // Product Image
    times_bought: { type: Number, default: 0 }, // Tracks how often item is bought
    times_wasted: { type: Number, default: 0 }, // Tracks how often item is wasted
    user_id: { type: Number, required: true }, // User association
    variations: [
        {
            packaging: { type: String }, // "Carton, 1L"
            quantity: { type: String }, // "1L"
        }
    ]
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;