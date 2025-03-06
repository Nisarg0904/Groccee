require("dotenv").config();
const axios = require('axios');
const UserPreference = require("../models/userPreference");

async function getRecommendation(userPurchaseHistory) {
  // URL of your Python microservice (adjust port/path if needed)
  const url = 'http://localhost:6000/get_recommendation';

  try {
    // Pass the purchaseHistory as JSON to the Python service
    const response = await axios.post(url, { purchaseHistory: userPurchaseHistory }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000 // 30 seconds timeout, adjust if needed
    });
    console.log("Received recommendation from Python service:", response.data);
    
    // Assuming your Python service returns { recommendation: "..." }
    return response.data.recommendation;
  } catch (err) {
    console.error("Error fetching recommendation from Python service:", err.response ? err.response.data : err.message);
    throw err;
  }
}

async function createOrUpdatePreference(req, res) {
  const {
    user_id,
    item_id,
    packaging_unit,
    purchaseHistory,
    totalBought,
    wasteHistory,
    totalWasted,
    preferenceScore,
  } = req.body;

  try {
    const preference = await UserPreference.findOneAndUpdate(
      { user_id, item_id, packaging_unit },
      {
        purchaseHistory,
        totalBought,
        wasteHistory,
        totalWasted,
        preferenceScore,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(preference);
  } catch (error) {
    console.error('Error in createOrUpdatePreference:', error.message);
    res.status(400).json({ message: error.message });
  }
}

async function getUserPreference(req, res) {
  const { user_id, item_id, packaging_unit } = req.params;

  try {
    const preference = await UserPreference.findOne({
      user_id,
      item_id,
      packaging_unit,
    });

    if (!preference) {
      return res.status(404).json({ message: "User preference not found" });
    }

    res.status(200).json(preference);
  } catch (error) {
    console.error('Error in getUserPreference:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getUserPreferences(req, res) {
  const { user_id } = req.params;

  try {
    const preferences = await UserPreference.find({ user_id });
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error in getUserPreferences:', error.message);
    res.status(500).json({ message: error.message });
  }
}

async function getRecommendationEndpoint(req, res) {
  try {
    const { purchaseHistory } = req.body;
    if (!purchaseHistory) {
      return res.status(400).json({ message: "Missing purchaseHistory in request body" });
    }

    const recommendation = await getRecommendation(purchaseHistory);
    res.status(200).json({ recommendation });
  } catch (error) {
    console.error("Error generating recommendation:", error.message);
    res.status(500).json({ message: "Failed to generate recommendation" });
  }
}

module.exports = {
  createOrUpdatePreference,
  getUserPreference,
  getUserPreferences,
  getRecommendationEndpoint,
  getRecommendation,
};
