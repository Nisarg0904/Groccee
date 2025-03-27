require("dotenv").config();
const axios = require("axios");
const UserPreference = require("../models/userPreference");
const userPreferenceBaseUrl =
  process.env.USER_PREFERENCE_SERVICE_URL || "http://localhost:6002";

/**
 * Calls the Python ML service with the given payload.
 * Uses the endpoint '/get_user_preference' as defined in the Python script.
 */
async function getRecommendation(payload) {
  const url = `${userPreferenceBaseUrl}/get_user_preference`;
  try {
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 120000, // 120 seconds timeout
    });
    console.log("Received recommendation from Python service:", response.data);
    return response.data;
  } catch (err) {
    console.error(
      "Error fetching recommendation from Python service:",
      err.response ? err.response.data : err.message
    );
    throw err;
  }
}

/**
 * Creates or updates a user preference record.
 * Expects the payload to include:
 *   - name, user_id, item_id, category, averageBuyingPeriod, (optional: wastedMoney, recommendedPurchaseQuantity)
 *   - packaging: an object with { unit, averageBuyQuantity, preferred, shouldBuyLess, shouldBuyMore }
 * If a document for the given user_id and item_id exists, then update its fields and update (or add) the packaging object.
 */
async function createOrUpdatePreference(req, res) {
  const {
    user_id,
    item_id,
    packaging, // Object: { unit, averageBuyQuantity, preferred, shouldBuyLess, shouldBuyMore }
    name,
    category,
    averageBuyingPeriod,
    wastedMoney,
    recommendedPurchaseQuantity,
  } = req.body;

  try {
    // Find existing document for user_id and item_id
    let document = await UserPreference.findOne({ user_id, item_id });

    if (!document) {
      // Create new document with packaging as an array containing the provided packaging object
      document = new UserPreference({
        name,
        user_id,
        item_id,
        category,
        averageBuyingPeriod,
        wastedMoney,
        recommendedPurchaseQuantity,
        packaging: [packaging],
      });
    } else {
      // Update top-level fields
      document.name = name;
      document.category = category;
      document.averageBuyingPeriod = averageBuyingPeriod;
      if (wastedMoney !== undefined) document.wastedMoney = wastedMoney;
      if (recommendedPurchaseQuantity !== undefined)
        document.recommendedPurchaseQuantity = recommendedPurchaseQuantity;

      // Update packaging: check if packaging for the given unit already exists
      const index = document.packaging.findIndex(
        (p) => p.unit === packaging.unit
      );
      if (index >= 0) {
        // Update the existing packaging object
        document.packaging[index] = packaging;
      } else {
        // Add the new packaging object
        document.packaging.push(packaging);
      }
    }

    await document.save();
    res.status(200).json(document);
  } catch (error) {
    console.error("Error in createOrUpdatePreference:", error.message);
    res.status(400).json({ message: error.message });
  }
}

/**
 * Retrieves a single user preference for the specified packaging unit.
 * Expects URL parameters: user_id, item_id, packaging_unit.
 * It finds the document by user_id and item_id and returns the packaging object matching packaging_unit.
 */
async function getUserPreference(req, res) {
  const { user_id, item_id, packaging_unit } = req.params;

  try {
    const document = await UserPreference.findOne({ user_id, item_id });
    if (!document) {
      return res.status(404).json({ message: "User preference not found" });
    }
    const packagingPreference = document.packaging.find(
      (p) => p.unit === packaging_unit
    );
    if (!packagingPreference) {
      return res
        .status(404)
        .json({ message: "Packaging preference not found" });
    }
    // Return the document with the packaging field replaced by the matched packaging object
    res
      .status(200)
      .json({ ...document.toObject(), packaging: packagingPreference });
  } catch (error) {
    console.error("Error in getUserPreference:", error.message);
    res.status(500).json({ message: error.message });
  }
}

/**
 * Retrieves all preferences for a given user.
 * Expects URL parameter: user_id.
 */
async function getUserPreferences(req, res) {
  const { user_id } = req.params;

  try {
    const preferences = await UserPreference.find({ user_id });
    res.status(200).json(preferences);
  } catch (error) {
    console.error("Error in getUserPreferences:", error.message);
    res.status(500).json({ message: error.message });
  }
}

/**
 * Endpoint for testing or debugging the ML recommendation.
 * Even though your model does not include purchase history,
 * the Python service expects keys: purchaseHistory, itemDetails, and wasteHistory.
 * Here, the controller maps wasteHistory to wastageData.
 */
async function getRecommendationEndpoint(req, res) {
  try {
    const { purchaseHistory, itemDetails, wasteHistory } = req.body;
    if (!purchaseHistory) {
      return res
        .status(400)
        .json({ message: "Missing purchaseHistory in request body" });
    }
    const payload = {
      purchaseHistory,
      itemDetails,
      wastageData: wasteHistory,
    };
    const recommendation = await getRecommendation(payload);
    res.status(200).json({ recommendation });
  } catch (error) {
    console.error("Error generating recommendation:", error.message);
    res.status(500).json({ message: "Failed to generate recommendation" });
  }
}

/**
 * Updates user preference with ML analysis.
 * Expects the payload to include:
 *   - user_id, item_id, packaging_unit, purchaseHistory, itemDetails, wasteHistory,
 *     plus optional top-level fields (name, category, averageBuyingPeriod).
 * The existing document is found by user_id and item_id.
 * The payload is sent to the ML service, and the returned data is used to update the document.
 * The packaging array is updated based on the packaging_unit.
 */
async function updatePreferenceWithML(req, res) {
  const {
    user_id,
    item_id,
    packaging_unit, // used to identify which packaging object to update
    purchaseHistory,
    itemDetails,
    wasteHistory, // will be mapped to wastageData
    name,
    category,
    averageBuyingPeriod,
  } = req.body;

  try {
    // Find existing document by user_id and item_id
    const document = await UserPreference.findOne({ user_id, item_id });

    // Build payload for ML service.
    const payload = {
      purchaseHistory,
      itemDetails,
      wastageData: wasteHistory,
      oldUserPreference: document || {},
    };

    // Call the ML service using axios.post inline
    const url = `${userPreferenceBaseUrl}/get_user_preference`;
    let updatedPreferenceData;
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 120000, // 120 seconds timeout
      });
      console.log(
        "Received recommendation from Python service:",
        response.data
      );
      updatedPreferenceData = response.data;
    } catch (err) {
      console.error(
        "Error fetching recommendation from Python service:",
        err.response ? err.response.data : err.message
      );
      throw err;
    }

    // Ensure required identifiers and top-level fields are included
    updatedPreferenceData.user_id = user_id;
    updatedPreferenceData.item_id = item_id;
    if (name) updatedPreferenceData.name = name;
    if (category) updatedPreferenceData.category = category;
    if (averageBuyingPeriod)
      updatedPreferenceData.averageBuyingPeriod = averageBuyingPeriod;

    // Update or create the document
    if (!document) {
      // If no document exists, create one
      const newDoc = new UserPreference(updatedPreferenceData);
      await newDoc.save();
      res.status(200).json(newDoc);
    } else {
      // Update top-level fields
      document.name = updatedPreferenceData.name;
      document.category = updatedPreferenceData.category;
      document.averageBuyingPeriod = updatedPreferenceData.averageBuyingPeriod;
      document.wastedMoney = updatedPreferenceData.wastedMoney;
      document.recommendedPurchaseQuantity =
        updatedPreferenceData.recommendedPurchaseQuantity;

      // Update the packaging array:
      // Find the packaging object that matches the provided packaging_unit in the ML output.
      const mlPackaging = updatedPreferenceData.packaging.find(
        (p) => p.unit === packaging_unit
      );
      if (mlPackaging) {
        const index = document.packaging.findIndex(
          (p) => p.unit === packaging_unit
        );
        if (index >= 0) {
          document.packaging[index] = mlPackaging;
        } else {
          document.packaging.push(mlPackaging);
        }
      }
      await document.save();
      res.status(200).json(document);
    }
  } catch (error) {
    console.error("Error in updatePreferenceWithML:", error.message);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createOrUpdatePreference,
  getUserPreference,
  getUserPreferences,
  getRecommendationEndpoint,
  getRecommendation,
  updatePreferenceWithML,
};
