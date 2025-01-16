const express = require('express');
const {
  createUserPreference,
  getAllUserPreferences,
  getUserPreferenceById,
  updateUserPreference,
  deleteUserPreference,
} = require('../controllers/userPreferenceControllerr');

const router = express.Router();

router.post('/', createUserPreference); // Create
router.get('/', getAllUserPreferences); // Read All
router.get('/:id', getUserPreferenceById); // Read by ID
router.put('/:id', updateUserPreference); // Update by ID
router.delete('/:id', deleteUserPreference); // Delete by ID

module.exports = router;
