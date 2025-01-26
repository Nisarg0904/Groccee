const Wastage = require("../models/wastage");
const { validateUser, validateItem } = require("../utils/apiHelper");

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

module.exports = {
  createWastage,
  getAllWastages,
  getWastageById,
  updateWastage,
  deleteWastage,
};
