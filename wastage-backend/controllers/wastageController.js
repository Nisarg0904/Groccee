const Wastage = require("../models/wastage");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const wastageController = {


   createWastagePublic : async (req, res) => {
  try {
    const {
      user_id,
      item_id,
      item_name,
      item_unit,
      wasted_quantity,
      wastage_date,
      reason_for_waste,
      category,
      wasted_money,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const newWastage = await Wastage.create({
      user_id,
      item_id,
      item_name,
      item_unit,
      wasted_quantity,
      wastage_date,
      reason_for_waste,
      category,
      wasted_money,
    });

    res.status(201).json({ message: "Wastage record created", data: newWastage });
  } catch (error) {
    res.status(500).json({
      message: "Error creating wastage record",
      error: error.message,
    });
  }
},

/**
 * Public endpoint to get all wastage records for a given item ID.
 * No token is required.
 */
 getAllWastageByItemIdPublic : async (req, res) => {
  try {
    const { item_id } = req.params;
    if (!item_id) {
      return res.status(400).json({ message: "Item ID is required." });
    }

    const wastageRecords = await Wastage.findAll({
      where: { item_id },
      order: [["wastage_date", "DESC"]],
    });

    res.status(200).json(wastageRecords);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving wastage records",
      error: error.message,
    });
  }
},



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

      const wastageRecords = await Wastage.findAll({ 
        where: { user_id },
        order: [["wastage_date", "DESC"]]
      });
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

      // Use wastage_id instead of id
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
        order: [["wastage_date", "DESC"]]
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

      // Convert "YYYY-MM-DD" to a date range (from start to end of the day)
      const startDate = new Date(date);
      startDate.setUTCHours(0, 0, 0, 0); // Start of the day
      const endDate = new Date(date);
      endDate.setUTCHours(23, 59, 59, 999); // End of the day

      // Query for the entire day, ignoring time
      const wastageRecords = await Wastage.findAll({
        where: {
          wastage_date: {
            [Op.between]: [startDate, endDate] // Query for full date range
          },
          user_id
        },
        order: [["wastage_date", "DESC"]]
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving wastage records",
        error: error.message,
      });
    }
  },

  // Get wastage by date range (for weekly and monthly views)
  getWastageByDateRange: async (req, res) => {
    try {
      const { start, end } = req.query;
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates are required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      const startDate = new Date(start);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(end);
      endDate.setUTCHours(23, 59, 59, 999);

      const wastageRecords = await Wastage.findAll({
        where: {
          wastage_date: {
            [Op.between]: [startDate, endDate]
          },
          user_id
        },
        order: [["wastage_date", "DESC"]]
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error retrieving wastage records by date range",
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
        order: [["wastage_date", "DESC"]]
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

      res.status(200).json({ item_id, total_wasted_amount: totalAmount || 0 });
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

      res.status(200).json({ category, total_wasted_amount: totalAmount || 0 });
    } catch (error) {
      res.status(500).json({
        message: "Error calculating total wasted amount",
        error: error.message,
      });
    }
  },

  // Get weekly wastage statistics
  getWeeklyWastageStats: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // Get current date and calculate date for 8 weeks ago
      const currentDate = new Date();
      const startDate = new Date();
      startDate.setDate(currentDate.getDate() - 56); // 8 weeks ago

      const wastageRecords = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.gte]: startDate,
            [Op.lte]: currentDate
          }
        },
        attributes: [
          'wastage_date',
          'wasted_money',
          'category',
          'item_name'
        ],
        order: [["wastage_date", "ASC"]]
      });

      // Process records to group by week
      const weeklyStats = {};

      wastageRecords.forEach(record => {
        const date = new Date(record.wastage_date);
        const weekStart = getStartOfWeek(date);
        const weekKey = formatDate(weekStart);

        if (!weeklyStats[weekKey]) {
          weeklyStats[weekKey] = {
            week_start: weekStart,
            week_end: new Date(weekStart),
            total_amount: 0,
            count: 0,
            categories: {}
          };
          weeklyStats[weekKey].week_end.setDate(weekStart.getDate() + 6);
        }

        weeklyStats[weekKey].total_amount += parseFloat(record.wasted_money);
        weeklyStats[weekKey].count += 1;

        // Group by category within each week
        if (!weeklyStats[weekKey].categories[record.category]) {
          weeklyStats[weekKey].categories[record.category] = {
            amount: 0,
            count: 0
          };
        }
        weeklyStats[weekKey].categories[record.category].amount += parseFloat(record.wasted_money);
        weeklyStats[weekKey].categories[record.category].count += 1;
      });

      res.status(200).json(weeklyStats);
    } catch (error) {
      res.status(500).json({
        message: "Error calculating weekly wastage stats",
        error: error.message,
      });
    }
  },

  // Get monthly wastage statistics
  getMonthlyWastageStats: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // Get current date and calculate date for 12 months ago
      const currentDate = new Date();
      const startDate = new Date();
      startDate.setMonth(currentDate.getMonth() - 12);

      const wastageRecords = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.gte]: startDate,
            [Op.lte]: currentDate
          }
        },
        attributes: [
          'wastage_date',
          'wasted_money',
          'category',
          'item_name'
        ],
        order: [["wastage_date", "ASC"]]
      });

      // Process records to group by month
      const monthlyStats = {};

      wastageRecords.forEach(record => {
        const date = new Date(record.wastage_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyStats[monthKey]) {
          monthlyStats[monthKey] = {
            year: date.getFullYear(),
            month: date.getMonth(),
            month_name: getMonthName(date.getMonth()),
            total_amount: 0,
            count: 0,
            categories: {}
          };
        }

        monthlyStats[monthKey].total_amount += parseFloat(record.wasted_money);
        monthlyStats[monthKey].count += 1;

        // Group by category within each month
        if (!monthlyStats[monthKey].categories[record.category]) {
          monthlyStats[monthKey].categories[record.category] = {
            amount: 0,
            count: 0
          };
        }
        monthlyStats[monthKey].categories[record.category].amount += parseFloat(record.wasted_money);
        monthlyStats[monthKey].categories[record.category].count += 1;
      });

      res.status(200).json(monthlyStats);
    } catch (error) {
      res.status(500).json({
        message: "Error calculating monthly wastage stats",
        error: error.message,
      });
    }
  },

  // Get wastage summary (combines category, weekly, and monthly data)
  getWastageSummary: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // Get current date
      const currentDate = new Date();

      // Calculate date ranges
      const weekStart = getStartOfWeek(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const yearStart = new Date(currentDate.getFullYear(), 0, 1);
      const yearEnd = new Date(currentDate.getFullYear(), 11, 31);

      // Get all-time wastage by category
      const categoryStats = await Wastage.findAll({
        attributes: [
          'category',
          [sequelize.fn('SUM', sequelize.col('wasted_money')), 'total_amount'],
          [sequelize.fn('COUNT', sequelize.col('wastage_id')), 'count']
        ],
        where: { user_id },
        group: ['category'],
        order: [[sequelize.literal('total_amount'), 'DESC']]
      });

      // Get current week wastage
      const currentWeekWastage = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.between]: [weekStart, weekEnd]
          }
        }
      });

      const currentWeekTotal = currentWeekWastage.reduce(
        (sum, record) => sum + parseFloat(record.wasted_money), 0
      );

      // Get current month wastage
      const currentMonthWastage = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.between]: [monthStart, monthEnd]
          }
        }
      });

      const currentMonthTotal = currentMonthWastage.reduce(
        (sum, record) => sum + parseFloat(record.wasted_money), 0
      );

      // Get current year wastage
      const currentYearWastage = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.between]: [yearStart, yearEnd]
          }
        }
      });

      const currentYearTotal = currentYearWastage.reduce(
        (sum, record) => sum + parseFloat(record.wasted_money), 0
      );

      // Get total all-time wastage
      const totalResult = await Wastage.findOne({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('wasted_money')), 'total_amount'],
          [sequelize.fn('COUNT', sequelize.col('wastage_id')), 'count']
        ],
        where: { user_id }
      });

      const summary = {
        by_category: categoryStats.map(stat => ({
          category: stat.category,
          total_amount: parseFloat(stat.dataValues.total_amount) || 0,
          count: parseInt(stat.dataValues.count) || 0
        })),
        current_week: {
          start_date: weekStart,
          end_date: weekEnd,
          total_amount: currentWeekTotal,
          count: currentWeekWastage.length
        },
        current_month: {
          month: currentDate.getMonth(),
          month_name: getMonthName(currentDate.getMonth()),
          year: currentDate.getFullYear(),
          total_amount: currentMonthTotal,
          count: currentMonthWastage.length
        },
        current_year: {
          year: currentDate.getFullYear(),
          total_amount: currentYearTotal,
          count: currentYearWastage.length
        },
        all_time: {
          total_amount: parseFloat(totalResult.dataValues.total_amount) || 0,
          count: parseInt(totalResult.dataValues.count) || 0
        }
      };

      res.status(200).json(summary);
    } catch (error) {
      res.status(500).json({
        message: "Error generating wastage summary",
        error: error.message,
      });
    }
  },

  // Get current week's wastage
  getCurrentWeekWastage: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // Get current date and calculate week start/end
      const currentDate = new Date();
      const weekStart = getStartOfWeek(currentDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const wastageRecords = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.between]: [weekStart, weekEnd]
          }
        },
        order: [["wastage_date", "DESC"]]
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching current week wastage",
        error: error.message,
      });
    }
  },

  // Get current month's wastage
  getCurrentMonthWastage: async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user_id = decoded.id;

      // Get current date and calculate month start/end
      const currentDate = new Date();
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const wastageRecords = await Wastage.findAll({
        where: { 
          user_id,
          wastage_date: {
            [Op.between]: [monthStart, monthEnd]
          }
        },
        order: [["wastage_date", "DESC"]]
      });

      res.status(200).json(wastageRecords);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching current month wastage",
        error: error.message,
      });
    }
  }
};

// Helper function to get start of week (Monday)
function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Helper function to get month name
function getMonthName(monthIndex) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[monthIndex];
}

module.exports = wastageController;