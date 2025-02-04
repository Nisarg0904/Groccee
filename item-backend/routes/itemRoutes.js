const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/Item");
const authenticateToken = require("../middleware/authMiddleware");
const { fetchOpenFoodFactsData } = require("../config/openFoodFacts");
const router = express.Router();

// ✅ Step 1: Fetch product details & pre-fill default values (BEFORE saving)
router.post("/pre-fill", authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (!name) {
      return res.status(400).json({ message: "Product name is required" });
  }

  try {
      const lowerCaseName = name.toLowerCase();
      let productData = await fetchOpenFoodFactsData(lowerCaseName);

      if (!productData) {
          return res.status(404).json({ message: "Item not found in Open Food Facts API" });
      }

      // Pre-fill with API values, but allow user changes
      return res.status(200).json({
          name: productData.name,
          category: productData.category,
          image_url: productData.image_url,
          variations: productData.variations
      });

  } catch (err) {
      console.error("Error fetching item:", err);
      res.status(500).json({ message: "Server error while fetching the item" });
  }
});

// ✅ Step 2: User confirms data and saves item
router.post("/", authenticateToken, async (req, res) => {
  const { name, category, image_url, packaging, quantity } = req.body;

  if (!name || !packaging || !quantity) {
      return res.status(400).json({ message: "Missing required fields: name, packaging, or quantity" });
  }

  try {
      const lowerCaseName = name.toLowerCase();

      let existingItem = await Item.findOne({ name: lowerCaseName, user_id: req.user.id });

      if (!existingItem) {
          const newItem = new Item({
              name: lowerCaseName,
              category: category || "Unknown",
              image_url: image_url || "",
              user_id: req.user.id,
              variations: [{ packaging, quantity }],
              times_bought: 0,
              times_wasted: 0
          });

          await newItem.save();
          return res.status(201).json({ message: "New item added", item: newItem });
      } else {
          // Check if variation exists
          const exists = existingItem.variations.some((v) => v.quantity === quantity);

          if (!exists) {
              existingItem.variations.push({ packaging, quantity });
              await existingItem.save();
              return res.status(201).json({ message: "New variation added", item: existingItem });
          } else {
              return res.status(400).json({ message: "Variation already exists", item: existingItem });
          }
      }
  } catch (err) {
      console.error("Error creating item:", err);
      res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all items for the authenticated user
router.get("/", authenticateToken, async (req, res) => {
    try {
        const items = await Item.find({ user_id: req.user.id });
        res.json(items);
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update an item (Allows updating name, category, or adding new variations)
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { name, category, packaging, quantity } = req.body;

        const item = await Item.findOne({ _id: req.params.id, user_id: req.user.id });

        if (!item) {
            return res.status(404).json({ message: "Item not found or access denied" });
        }

        if (name) item.name = name;
        if (category) item.category = category;

        if (packaging && quantity) {
            // Check if variation exists
            const exists = item.variations.some((v) => v.quantity === quantity);
            if (!exists) {
                item.variations.push({ packaging, quantity });
            }
        }

        const updatedItem = await item.save();
        res.json(updatedItem);
    } catch (err) {
        console.error("Error updating item:", err);
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete an item
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });

        if (!item) {
            return res.status(404).json({ message: "Item not found or access denied" });
        }

        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get item by name for the authenticated user
router.get("/by-name/:name", authenticateToken, async (req, res) => {
    try {
        const name = req.params.name.toLowerCase();
        const item = await Item.findOne({ name, user_id: req.user.id });

        if (!item) {
            // Try fetching from Open Food Facts API
            const productData = await fetchOpenFoodFactsData(name);
            if (productData) {
                return res.status(200).json({ message: "Item found in Open Food Facts API", item: productData });
            }
            return res.status(404).json({ message: "Item not found" });
        }

        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item by name:", error);
        res.status(500).json({ message: "Server error while fetching item" });
    }
});

// ✅ Get item by ID for the authenticated user
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const item = await Item.findOne({ _id: id, user_id: req.user.id });

        if (!item) {
            return res.status(404).json({ message: "Item not found or access denied" });
        }

        res.status(200).json(item);
    } catch (err) {
        console.error("Error fetching item:", err);
        res.status(500).json({ message: "Server error while fetching the item" });
    }
});

module.exports = router;
