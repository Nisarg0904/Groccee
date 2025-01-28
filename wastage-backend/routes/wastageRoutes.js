const express = require("express");
const {
  createWastage,
  getAllWastages,
  getWastageById,
  updateWastage,
  deleteWastage,
  processExpiredItems,
} = require("../controllers/wastageController");

const router = express.Router();


router.post("/", createWastage);
router.get("/", getAllWastages);
// Manually trigger wastage processing
router.post("/process-expired", processExpiredItems);
router.get("/:id", getWastageById);
router.put("/:id", updateWastage);
router.delete("/:id", deleteWastage);

module.exports = router;
