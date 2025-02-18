const Wastage = require("../models/wastage_model");

const wastageController = {
  // Create a new wastage record
  createWastage: async (req, res) => {
    try {
      const {
        item_id,
        item_name,
        item_unit,
        wasted_quantity,
        wastage_date,
        reason_for_waste,
        category,
        wasted_money,
        user_id,
      } = req.body;

      const newWastage = await Wastage.create({
        item_id,
        item_name,
        item_unit,
        wasted_quantity,
        wastage_date,
        reason_for_waste,
        category,
        wasted_money,
        user_id,
      });

      res
        .status(201)
        .json({ message: "Wastage record created", data: newWastage });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error creating wastage record",
          error: error.message,
        });
    }
  },

  // Get all wastage records
  getAllWastage: async (req, res) => {
    try {
      const wastageRecords = await Wastage.findAll();
      res.status(200).json(wastageRecords);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error retrieving wastage records",
          error: error.message,
        });
    }
  },

  // Get wastage by ID
  getWastageById: async (req, res) => {
    try {
      const { id } = req.params;
      const wastage = await Wastage.findByPk(id);

      if (!wastage) {
        return res.status(404).json({ message: "Wastage record not found" });
      }

      res.status(200).json(wastage);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error retrieving wastage record",
          error: error.message,
        });
    }
  },

  // Get wastage by item ID
  getWastageByItemId: async (req, res) => {
    try {
      const { item_id } = req.params;
      const wastageRecords = await Wastage.findAll({ where: { item_id } });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error retrieving wastage records",
          error: error.message,
        });
    }
  },

  // Get wastage for a specific date
  getWastageByDate: async (req, res) => {
    try {
      const { date } = req.params;
      const wastageRecords = await Wastage.findAll({
        where: { wastage_date: date },
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error retrieving wastage records",
          error: error.message,
        });
    }
  },

  // Get wastage by category
  getWastageByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const wastageRecords = await Wastage.findAll({ where: { category } });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error retrieving wastage records",
          error: error.message,
        });
    }
  },

  // Get total wasted amount for an item
  getTotalWastedAmountForItem: async (req, res) => {
    try {
      const { item_id } = req.params;
      const totalAmount = await Wastage.sum("wasted_money", {
        where: { item_id },
      });

      res.status(200).json({ item_id, total_wasted_amount: totalAmount });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error calculating total wasted amount",
          error: error.message,
        });
    }
  },

  // Get total wasted amount for a category
  getTotalWastedAmountForCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const totalAmount = await Wastage.sum("wasted_money", {
        where: { category },
      });

      res.status(200).json({ category, total_wasted_amount: totalAmount });
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Error calculating total wasted amount",
          error: error.message,
        });
    }
  },
};

module.exports = wastageController;
