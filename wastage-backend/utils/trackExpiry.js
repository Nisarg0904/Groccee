const axios = require("axios");
const Wastage = require("../models/wastage");
const GROCERYITEM_BACKEND_URL = process.env.GROCERYITEM_BACKEND_URL || "http://localhost:5004";

// Move expired items to the Wastage table
const moveExpiredItemsToWastage = async () => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

    // Fetch expired items from groceryitem-backend
    const response = await axios.get(`${GROCERYITEM_BACKEND_URL}/api/groceryitems/expired?date=${today}`);
    const expiredItems = response.data;

    for (const item of expiredItems) {
      // Check if the item is already in the Wastage table
      const existingWastage = await Wastage.findOne({
        where: { grocery_item_id: item.grocery_item_id },
      });

      if (!existingWastage) {
        // Move the expired item to the Wastage table
        await Wastage.create({
          wasted_quantity: item.available_quantity,
          reason_for_waste: "Expired",
          user_id: item.user_id,
          grocery_item_id: item.grocery_item_id,
        });

        console.log(`Moved item ${item.grocery_item_id} to wastage.`);
      } else {
        console.log(`Item ${item.grocery_item_id} is already in the wastage table.`);
      }
    }
  } catch (error) {
    console.error("Error moving expired items to wastage:", error.message);
  }
};

module.exports = moveExpiredItemsToWastage;
