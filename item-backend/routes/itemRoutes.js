const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  const { name, unit, price_per_unit, default_packaging } = req.body;

  if (!name || !unit || !price_per_unit) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const lowerCaseName = name.toLowerCase();

    // Check if an item with the same name exists
    const existingItem = await Item.findOne({ name: lowerCaseName });

    if (existingItem) {
      return res
        .status(400)
        .json({ message: `An item with the name "${name}" already exists.` });
    }

    // Create a new item
    const newItem = new Item({
      name: lowerCaseName,
      unit: unit.toLowerCase(),
      price_per_unit,
      default_packaging,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error creating item:", err);
    res.status(400).json({ message: err.message });
  }
});


// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err);
    res.status(500).json({ message: err.message });
  }
});

// Update an item
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(400).json({ message: err.message });
  }
});

// Delete an item
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get item by name
router.get("/by-name/:name", async (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const item = await Item.findOne({ name });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item by name:", error);
    res.status(500).json({ message: "Server error while fetching item" });
  }
});



// Get item by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ message: "Server error while fetching the item" });
  }
});

// Check and create item
router.post("/check-item", authenticateToken, async (req, res) => {
  const { name, default_packaging } = req.body;

  try {
    let item = await Item.findOne({ name });

    if (!item) {
      item = new Item({ name, default_packaging });
      await item.save();
    } else if (!item.default_packaging || item.default_packaging.length === 0) {
      item.default_packaging = default_packaging;
      await item.save();
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error checking item:", error);
    res.status(500).json({ message: "Error checking item" });
  }
});

module.exports = router;
