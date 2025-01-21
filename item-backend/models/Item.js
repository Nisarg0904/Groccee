const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Converts the name to lowercase before saving
    trim: true, // Removes whitespace around the name
  },
  unit: {
    type: String,
    required: true,
    lowercase: true, // Converts the unit to lowercase
  },
  price_per_unit: {
    type: Number,
    required: true,
  },
  default_packaging: [
    {
      quantity: { type: Number, required: true },
      unit: { type: String, required: true, lowercase: true },
      price: { type: Number, required: true },
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
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
