const SuggestedItem = require("../models/SuggestedItem");


// const createSuggestedItem = async (req, res) => {
//     try {
//         const { name, category, units } = req.body;

//         // Ensure required fields are provided
//         if (!name || !category || !units || !Array.isArray(units) || units.length === 0) {
//             return res.status(400).json({ message: "Name, category, and at least one unit are required." });
//         }

//         // Check if item already exists
//         const existingItem = await SuggestedItem.findOne({ name });
//         if (existingItem) {
//             return res.status(409).json({ message: "Suggested item already exists." });
//         }

//         // Create new suggested item
//         const newItem = new SuggestedItem({
//             name,
//             category,
//             units,
//             preferred_unit: units[0], // Ensuring first unit is used
//         });

//         await newItem.save();

//         return res.status(201).json({ message: "Suggested item created successfully.", item: newItem });
//     } catch (error) {
//         console.error("Error creating suggested item:", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// };

// Get all items
const getAllItems = async (req, res) => {
    try {
        const items = await SuggestedItem.find();
        if (items.length === 0) {
            return res.status(404).json({ message: "No items found" });
        }
        res.status(200).json(items);
    } catch (error) {
        console.error("❌ Error fetching items:", error); // Log the real error
        res.status(500).json({ message: "Error fetching items", error: error.message });
    }
};

// Get items by name (case insensitive search)
const getItemByName = async (req, res) => {
    try {
        const name = req.params.name;
        const item = await SuggestedItem.findOne({ name: { $regex: new RegExp(name, "i") } });
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching item", error });
    }
};

// Get items by category (case insensitive search)
const getItemsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const items = await SuggestedItem.find({ category: { $regex: new RegExp(category, "i") } });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items by category", error });
    }
};

// Get items by unit (case insensitive search)
const getItemsByUnit = async (req, res) => {
    try {
        const unit = req.params.unit;
        const items = await SuggestedItem.find({ units: { $regex: new RegExp(unit, "i") } });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items by unit", error });
    }
};

// Get all unique categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await SuggestedItem.distinct("category");
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error });
    }
};
const searchItemsByName = async (req, res) => {
  try {
    const searchQuery = req.params.query;
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Search for items where the name contains the query (case insensitive)
    const items = await SuggestedItem.find(
      { name: { $regex: new RegExp(searchQuery, "i") } },
      "name units category" // Fetch only name, units, and category
    );

    if (items.length === 0) {
      return res.status(404).json({ message: "No matching items found." });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error searching for items:", error);
    res.status(500).json({ message: "Error searching for items", error });
  }
};


const searchUnitsByQuery = async (req, res) => {
  try {
    const searchQuery = req.params.query;
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Find all items that contain the search query in their units (case insensitive)
    const items = await SuggestedItem.find(
      { units: { $regex: new RegExp(searchQuery, "i") } },
      "units"
    );

    // Extract all matching units and remove duplicates
    const unitSet = new Set();
    items.forEach((item) => {
      item.units.forEach((unit) => {
        if (unit.toLowerCase().includes(searchQuery.toLowerCase())) {
          unitSet.add(unit);
        }
      });
    });

    const units = Array.from(unitSet);

    if (units.length === 0) {
      return res.status(404).json({ message: "No matching units found." });
    }

    res.status(200).json(units);
  } catch (error) {
    console.error("Error searching for units:", error);
    res.status(500).json({ message: "Error searching for units", error });
  }
};

const searchCategoriesByQuery = async (req, res) => {
  try {
    const searchQuery = req.params.query;
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Find all categories that match the search query (case insensitive)
    const categories = await SuggestedItem.distinct("category", {
      category: { $regex: new RegExp(searchQuery, "i") },
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: "No matching categories found." });
    }

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error searching for categories:", error);
    res.status(500).json({ message: "Error searching for categories", error });
  }
};

module.exports = {
  getAllItems,
  getItemByName,
  getItemsByCategory,
  getItemsByUnit,
  getAllCategories,
  searchItemsByName,
  searchUnitsByQuery,
  searchCategoriesByQuery,
};
