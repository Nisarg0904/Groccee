// routes/userPreference.routes.js

const express = require('express');
const router = express.Router();
const userPreferenceController = require('../controllers/userPreferenceController');


router.post('/get-recommendation', userPreferenceController.getRecommendationEndpoint);
// Create or update a user preference record
router.post('/', userPreferenceController.createOrUpdatePreference);

// Get all user preferences for a specific user
router.get('/:user_id', userPreferenceController.getUserPreferences);

// Get a specific user preference record based on user, item, and packaging unit
router.get('/:user_id/:item_id/:packaging_unit', userPreferenceController.getUserPreference);



module.exports = router;
