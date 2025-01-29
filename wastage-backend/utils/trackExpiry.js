const axios = require("axios");
const Wastage = require("../models/wastage");
const GROCERYITEM_BACKEND_URL = process.env.GROCERYITEM_BACKEND_URL || "http://localhost:5004";
const jwt = require("jsonwebtoken");

// ✅ Generate a valid system token
const generateServiceToken = () => {
  return jwt.sign({ id: "service-user", role: "system" }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const moveExpiredItemsToWastage = async () => {
  try {
    const today = new Date().toISOString().split("T")[0];

    console.log(`🔍 Checking for expired items from grocery-item-backend (Date: ${today})`);

    // ✅ Step 1: Generate a valid system token
    const userToken = generateServiceToken();
    console.log("🔑 Generated Token:", userToken);

    // ✅ Step 2: Fetch expired items including `user_id`
    const response = await axios.get(`${GROCERYITEM_BACKEND_URL}/api/groceryitems/expired?date=${today}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    const expiredItems = response.data;

    for (const item of expiredItems) {
      // ✅ Step 3: Check if item is already in wastage to prevent duplication
      const existingWastage = await Wastage.findOne({
        where: { grocery_item_id: item.grocery_item_id },
      });

      if (!existingWastage) {
        // ✅ Step 4: Move expired item to wastage while keeping `user_id`
        await Wastage.create({
          wasted_quantity: item.available_quantity,
          reason_for_waste: "Expired",
          user_id: item.user_id, // ✅ Ensure `user_id` is stored
          grocery_item_id: item.grocery_item_id,
        });

        console.log(`✅ Moved item ${item.grocery_item_id} to wastage for user ${item.user_id}.`);

        // ✅ Step 5: Delete the expired item from grocery-item-backend
        await axios.delete(`${GROCERYITEM_BACKEND_URL}/api/groceryitems/${item.grocery_item_id}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        console.log(`🗑️ Deleted expired item ${item.grocery_item_id} from grocery-item.`);
      } else {
        console.log(`⚠️ Item ${item.grocery_item_id} is already in wastage.`);
      }
    }
  } catch (error) {
    if (error.response) {
      console.error("❌ Error moving expired items to wastage:", error.response.status, error.response.data);
    } else {
      console.error("❌ Error moving expired items to wastage:", error.message);
    }
  }
};

module.exports = moveExpiredItemsToWastage;
