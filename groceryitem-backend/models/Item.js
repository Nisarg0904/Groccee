const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  unit: { type: String, required: true },
  price_per_unit: { type: Number, required: true },
  default_packaging: [
    {
      quantity: { type: Number },
      unit: { type: String },
      price: { type: Number },
    },
  ],
  times_bought: { type: Number, default: 0 },
  times_wasted: { type: Number, default: 0 },
});

module.exports = mongoose.model("Item", itemSchema);
