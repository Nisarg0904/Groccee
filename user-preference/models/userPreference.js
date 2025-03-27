const mongoose = require("mongoose");

// Define a sub-schema for packaging-specific preferences
const PackagingPreferenceSchema = new mongoose.Schema(
  {
    unit: { type: String, required: true }, // e.g., "liters", "cartons"
    averageBuyQuantity: { type: Number, required: true }, // Average quantity bought for this packaging unit
    preferred: { type: Boolean, default: false }, // Indicates if this packaging unit is preferred by the user
    shouldBuyLess: { type: Boolean, default: false }, // Recommendation: user should buy less of this unit (e.g., due to high wastage)
    shouldBuyMore: { type: Boolean, default: false }, // Recommendation: user should buy more of this unit (e.g., to avoid frequent stockouts)
  },
  { _id: false }
);

// Main schema for user preferences
const UserPreferenceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  user_id: { type: Number, required: true }, // User identifier from your auth system
  item_id: { type: String, required: true }, // Item identifier as a string (independent database)
  category: { type: String, required: true }, // Category of the item (e.g., dairy, bakery)
  packaging: [PackagingPreferenceSchema], // Array of packaging preferences
  averageBuyingPeriod: { type: Number, required: true }, // In days (e.g., every 2 days, weekly)
  wastedMoney: { type: Number, default: 0 }, // Aggregated wasted money on this item
  lastUpdated: { type: Date, default: Date.now }, // Timestamp for the last update
  recommendedPurchaseQuantity: { type: Number }, // Optionally store a computed recommendation
});

// Create and export the model
module.exports = mongoose.model("UserPreference", UserPreferenceSchema);
