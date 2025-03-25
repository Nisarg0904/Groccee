// publicWastageRoutes.js
const express = require("express");
const router = express.Router();
const {
  createWastagePublic,
  getAllWastageByItemIdPublic,
} = require("../controllers/wastageController");

// Public endpoint to create a wastage record without token
router.post("/system", createWastagePublic);

// Public endpoint to get all wastage records for an item without token
router.get("/all/:item_id", getAllWastageByItemIdPublic);

module.exports = router;
