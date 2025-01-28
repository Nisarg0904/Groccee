const axios = require("axios");
const Wastage = require("../models/wastage");
const GROCERYITEM_BACKEND_URL = process.env.GROCERYITEM_BACKEND_URL || "http://localhost:5004";

// Function to track and process expired items
const trackExpiryAndMoveToWastage = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

    // Fetch items expiring today or already expired
    const response = await axios.get(`${GROCERYITEM_BACKEND_URL}/api/groceryitems/expired?date=${today}`);
    const expiredItems = response.data; // Assuming the backend returns an array of expired items

    for (const item of expiredItems) {
      // Create a record in the Wastage table
      await Wastage.create({
        wasted_quantity: item.available_quantity,
        reason_for_waste: "Expired",
        user_id: item.user_id,
        grocery_item_id: item.grocery_item_id,
      });

      // Update the item status to "expired" via groceryitem-backend
      await axios.patch(`${GROCERYITEM_BACKEND_URL}/api/groceryitems/${item.grocery_item_id}`, {
        status: "expired",
      });
    }

    console.log(`${expiredItems.length} items processed as expired and moved to wastage.`);
  } catch (error) {
    console.error("Error in tracking expiry and moving to wastage:", error.message);
  }
};

module.exports = trackExpiryAndMoveToWastage;
