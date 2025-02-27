const express = require("express");
const wastageController = require("../controllers/wastageController");
const authenticateUser = require("../middleware/authMiddleware"); // Import auth middleware

const router = express.Router();


router.use(authenticateUser)

// Get wastage by date range
router.get('/daterange', wastageController.getWastageByDateRange);

// Create a new wastage record
router.post('/', wastageController.createWastage);

// Get all wastage records
router.get('/', wastageController.getAllWastage);

// Get wastage by ID
router.get('/:id', wastageController.getWastageById);

// Get wastage by item ID
router.get('/item/:item_id', wastageController.getWastageByItemId);

// Get wastage by date
router.get('/date/:date', wastageController.getWastageByDate);



// Get wastage by category
router.get('/category/:category', wastageController.getWastageByCategory);

// Get total wasted amount for an item
router.get('/total/item/:item_id', wastageController.getTotalWastedAmountForItem);

// Get total wasted amount for a category
router.get('/total/category/:category', wastageController.getTotalWastedAmountForCategory);

// Get weekly wastage statistics
router.get('/stats/weekly', wastageController.getWeeklyWastageStats);

// Get monthly wastage statistics
router.get('/stats/monthly', wastageController.getMonthlyWastageStats);

// Get wastage summary (combines category, weekly, and monthly data)
router.get('/summary', wastageController.getWastageSummary);

// Get current week's wastage
router.get('/current-week', wastageController.getCurrentWeekWastage);

// Get current month's wastage
router.get('/current-month', wastageController.getCurrentMonthWastage);

module.exports = router;