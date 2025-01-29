const Wastage = require("../models/wastage");
const { validateUser, validateItem } = require("../utils/apiHelper");
const moveExpiredItemsToWastage = require("../utils/trackExpiry")

// Create a new wastage record
const createWastage = async (req, res) => {
  const { wasted_quantity, reason_for_waste, user_id, grocery_item_id } = req.body;

  try {
    // Validate user and item
    await validateUser(user_id);
    await validateItem(grocery_item_id);

    // Create a new wastage record
    const wastage = await Wastage.create({
      wasted_quantity,
      reason_for_waste,
      user_id,
      grocery_item_id,
    });

    res.status(201).json(wastage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all wastage records
const getAllWastages = async (req, res) => {
  try {
    const wastages = await Wastage.findAll();
    res.status(200).json(wastages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve wastages" });
  }
};

// Get a single wastage record by ID
const getWastageById = async (req, res) => {
  const { id } = req.params;

  try {
    const wastage = await Wastage.findByPk(id);

    if (!wastage) {
      return res.status(404).json({ error: "Wastage record not found" });
    }

    res.status(200).json(wastage);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve wastage record" });
  }
};

// Update a wastage record
const updateWastage = async (req, res) => {
  const { id } = req.params;
  const { wasted_quantity, reason_for_waste } = req.body;

  try {
    const wastage = await Wastage.findByPk(id);

    if (!wastage) {
      return res.status(404).json({ error: "Wastage record not found" });
    }

    wastage.wasted_quantity = wasted_quantity || wastage.wasted_quantity;
    wastage.reason_for_waste = reason_for_waste || wastage.reason_for_waste;

    await wastage.save();

    res.status(200).json(wastage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update wastage record" });
  }
};

// Delete a wastage record
const deleteWastage = async (req, res) => {
  const { id } = req.params;

  try {
    const wastage = await Wastage.findByPk(id);

    if (!wastage) {
      return res.status(404).json({ error: "Wastage record not found" });
    }

    await wastage.destroy();
    res.status(200).json({ message: "Wastage record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete wastage record" });
  }
};

// ✅ Get wastage items for the logged-in user
const getUserWastages = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Get `user_id` from token

    console.log(`🔍 Fetching wastage items for user: ${userId}`);

    const wastages = await Wastage.findAll({
      where: { user_id: userId }, // ✅ Fetch only the logged-in user's wastage items
    });

    if (wastages.length === 0) {
      return res.status(404).json({ message: "No wastage records found for this user." });
    }

    res.status(200).json(wastages);
  } catch (error) {
    console.error("Error fetching wastage items:", error.message);
    res.status(500).json({ message: "Failed to fetch wastage records" });
  }
};

//manually triggers wastage
const processExpiredItems = async (req, res) => {
  try {
    console.log("✅ Manually triggering expired items processing...");
    await moveExpiredItemsToWastage(); // Call the function that normally runs at midnight
    res.status(200).json({ message: "Expired items processed successfully." });
  } catch (error) {
    console.error(" Error processing expired items manually:", error.message);
    res.status(500).json({ message: "Failed to process expired items." });
  }
};





module.exports = {
  createWastage,
  getAllWastages,
  getWastageById,
  updateWastage,
  deleteWastage,
  processExpiredItems,
  getUserWastages,
};
