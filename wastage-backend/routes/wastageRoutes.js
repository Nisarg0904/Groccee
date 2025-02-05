const express = require("express");
const {
  createWastage,
  getAllWastages,
  getWastageById,
  updateWastage,
  deleteWastage,
  processExpiredItems,
  getUserWastages,
} = require("../controllers/wastageController");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/",authenticateToken, createWastage);
router.get("/", authenticateToken, getAllWastages);
// Manually trigger wastage processing
router.post("/process-expired", authenticateToken, processExpiredItems);
router.get("/user", authenticateToken, getUserWastages);
// router.get("/:id", getWastageById);
// router.put("/:id", updateWastage);
// router.delete("/:id", deleteWastage);
router.get("/:id([0-9]+)", authenticateToken, getWastageById);
router.put("/:id([0-9]+)", authenticateToken, updateWastage);
router.delete("/:id([0-9]+)", authenticateToken, deleteWastage);

module.exports = router;
