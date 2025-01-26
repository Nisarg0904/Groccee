const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// Create an item
router.post("/", authenticateToken, async (req, res) => {
  const { name, unit, price_per_unit, default_packaging } = req.body;

  if (!name || !unit || price_per_unit === undefined) {
    return res
      .status(400)
      .json({
        message: "Missing required fields: name, unit, or price_per_unit",
      });
  }

  try {
    const lowerCaseName = name.toLowerCase();
    const existingItem = await Item.findOne({
      name: lowerCaseName,
      user_id: req.user.id,
    });

    if (existingItem) {
      return res.status(400).json({
        message: `An item with the name "${name}" already exists for this user.`,
      });
    }

    const newItem = new Item({
      name: lowerCaseName,
      unit: unit.toLowerCase(),
      price_per_unit,
      default_packaging: default_packaging || [], // Default to empty array
      user_id: req.user.id,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get all items for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const items = await Item.find({ user_id: req.user.id });
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      req.body,
      { new: true }
    );

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or access denied" });
    }

    res.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or access denied" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get item by name for the authenticated user
router.get("/by-name/:name", authenticateToken, async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const item = await Item.findOne({ name, user_id: req.user.id });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item by name:", error);
    res.status(500).json({ message: "Server error while fetching item" });
  }
});

// Get item by ID for the authenticated user
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const item = await Item.findOne({ _id: id, user_id: req.user.id });

    if (!item) {
      return res
        .status(404)
        .json({ message: "Item not found or access denied" });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ message: "Server error while fetching the item" });
  }
});

module.exports = router;
