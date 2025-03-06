// models/userPreference.model.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const userPreferenceSchema = new Schema({
  user_id: {
    type: Number,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
  packaging_unit: {
    type: String,
    required: true,
  },
  // Detailed purchase history for this user/item/packaging
  purchaseHistory: [
    {
      date: { type: Date, default: Date.now },
      quantity: { type: Number, default: 1 },
    }
  ],
  // Total times purchased (aggregated)
  totalBought: {
    type: Number,
    default: 0,
  },
  // Detailed waste history (if applicable)
  wasteHistory: [
    {
      date: { type: Date, default: Date.now },
      quantity: { type: Number, default: 1 },
    }
  ],
  // Total times wasted (aggregated)
  totalWasted: {
    type: Number,
    default: 0,
  },
  // The ML-generated preference score (e.g., 0 to 1 or 0 to 100)
  preferenceScore: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Compound index to ensure uniqueness per user/item/packaging combination
userPreferenceSchema.index({ user_id: 1, item_id: 1, packaging_unit: 1 }, { unique: true });

module.exports = mongoose.model("UserPreference", userPreferenceSchema);
