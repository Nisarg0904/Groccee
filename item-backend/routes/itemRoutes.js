const express = require("express");
const Item = require("../models/Item");
const router = express.Router();
const mongoose = require("mongoose");

// Create a new item
router.post("/", async (req, res) => {
  try {
    const { name, unit, price_per_unit, default_packaging } = req.body;
    const newItem = new Item({ name, unit, price_per_unit, default_packaging });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Fetch the item
    const item = await Item.findById(id);

    // If the item is not found
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item:", err); // Log the error
    res.status(500).json({ message: "Server error while fetching the item" });
  }
});


module.exports = router;
