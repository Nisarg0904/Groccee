const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is still required to uniquely identify the item
    unique: false,
    lowercase: true,
    trim: true,
  },
  unit: {
    type: String,
    required: false, // Unit is now optional for minimal item creation
    lowercase: true,
  },
  price_per_unit: {
    type: Number,
    required: false, // Price per unit is now optional
  },
  default_packaging: [
    {
      quantity: { type: Number, required: false }, // Quantity is optional for future items
      unit: { type: String, required: false, lowercase: true }, // Unit is optional for default packaging
      price: { type: Number, required: false }, // Price is optional for default packaging
    },
  ],
  times_bought: {
    type: Number,
    default: 0,
  },
  times_wasted: {
    type: Number,
    default: 0,
  },
  user_id: { type: Number, required: true }, // Numeric ID from PostgreSQL, still required to associate with a user
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
