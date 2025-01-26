const express = require("express");
const {
  createWastage,
  getAllWastages,
  getWastageById,
  updateWastage,
  deleteWastage,
} = require("../controllers/wastageController");

const router = express.Router();


router.post("/", createWastage);
router.get("/", getAllWastages);
router.get("/:id", getWastageById);
router.put("/:id", updateWastage);
router.delete("/:id", deleteWastage);

module.exports = router;
