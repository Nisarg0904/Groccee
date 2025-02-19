const Wastage = require("../models/wastage");
const jwt = require("jsonwebtoken"); // Assuming you're using JWT for authentication
const { Op } = require("sequelize"); // ✅ Import Sequelize Operators

const wastageController = {
  // Create a new wastage record for the authenticated user
  createWastage: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract the token
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
      const user_id = decoded.id; // Assuming 'id' is stored in the token payload

      const {
        item_id,
        item_name,
        item_unit,
        wasted_quantity,
        wastage_date,
        reason_for_waste,
        category,
        wasted_money,
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
        user_id, // Assign user_id from token
      });

      res
        .status(201)
        .json({ message: "Wastage record created", data: newWastage });
    } catch (error) {
      res.status(500).json({
        message: "Error creating wastage record",
        error: error.message,
      });
    }
  },

  // Get all wastage records for the authenticated user
  getAllWastage: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const wastageRecords = await Wastage.findAll({ where: { user_id } });
      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving wastage records",
        error: error.message,
      });
    }
  },

  // Get wastage by ID (for the authenticated user)
  getWastageById: async (req, res) => {
    try {
      const { id } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // ✅ Fix: Use wastage_id instead of id
      const wastage = await Wastage.findOne({
        where: { wastage_id: id, user_id },
      });

      if (!wastage) {
        return res.status(404).json({ message: "Wastage record not found" });
      }

      res.status(200).json(wastage);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving wastage record",
        error: error.message,
      });
    }
  },

  // Get wastage by item ID for the authenticated user
  getWastageByItemId: async (req, res) => {
    try {
      const { item_id } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const wastageRecords = await Wastage.findAll({
        where: { item_id, user_id },
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving wastage records",
        error: error.message,
      });
    }
  },

  // Get wastage for a specific date for the authenticated user

getWastageByDate: async (req, res) => {
    try {
        const { date } = req.params;
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.id;

        // ✅ Convert "YYYY-MM-DD" to a date range (from start to end of the day)
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0); // Start of the day
        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999); // End of the day

        // ✅ Query for the entire day, ignoring time
        const wastageRecords = await Wastage.findAll({
            where: {
                wastage_date: {
                    [Op.between]: [startDate, endDate] // ✅ Query for full date range
                },
                user_id
            }
        });

        res.status(200).json(wastageRecords);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving wastage records",
            error: error.message,
        });
    }
},


  // Get wastage by category for the authenticated user
  getWastageByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const wastageRecords = await Wastage.findAll({
        where: { category, user_id },
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving wastage records",
        error: error.message,
      });
    }
  },

  // Get total wasted amount for an item (authenticated user)
  getTotalWastedAmountForItem: async (req, res) => {
    try {
      const { item_id } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const totalAmount = await Wastage.sum("wasted_money", {
        where: { item_id, user_id },
      });

      res.status(200).json({ item_id, total_wasted_amount: totalAmount });
    } catch (error) {
      res.status(500).json({
        message: "Error calculating total wasted amount",
        error: error.message,
      });
    }
  },

  // Get total wasted amount for a category (authenticated user)
  getTotalWastedAmountForCategory: async (req, res) => {
    try {
      const { category } = req.params;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const totalAmount = await Wastage.sum("wasted_money", {
        where: { category, user_id },
      });

      res.status(200).json({ category, total_wasted_amount: totalAmount });
    } catch (error) {
      res.status(500).json({
        message: "Error calculating total wasted amount",
        error: error.message,
      });
    }
  },
};

module.exports = wastageController;
