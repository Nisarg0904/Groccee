const mongoose = require("mongoose");

const SuggestedItemSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    preferred_unit: { 
        type: String, 
        required: true, 
        default: function() {
            return this.units?.[0] || "Unit"; // Use first unit, fallback to "Unit"
        } 
    },
    units: [{ type: String, required: true }]
});

module.exports = mongoose.model("SuggestedItem", SuggestedItemSchema, "suggestedItems");