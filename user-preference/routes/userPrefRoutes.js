const express = require("express");
const router = express.Router();
const {
  createOrUpdatePreference,
  getUserPreference,
  getUserPreferences,
  getRecommendationEndpoint,
  updatePreferenceWithML,
} = require("../controllers/userPreferenceController");

router.put("/ml", updatePreferenceWithML);
// Create or update a user preference record
router.post("/", createOrUpdatePreference);

// Get a single user preference by user_id, item_id, and packaging_unit
router.get("/:user_id/:item_id/:packaging_unit", getUserPreference);

// Get all preferences for a given user
router.get("/:user_id", getUserPreferences);

// Get recommendation from ML service (for testing or debugging)
router.post("/recommendation", getRecommendationEndpoint);

// Update preference with ML analysis (attaches old preference and returns updated record)

module.exports = router;
