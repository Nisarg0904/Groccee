const axios = require("axios");
const GroceryItem = require("./models/grocery_item");
const { addWastage } = require("./utils/apiHelper");

const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // Runs once a day

/**
 * Check grocery items, update status, and move expired items to wastage.
 */
async function checkAndUpdateGroceryItems() {
  try {
    console.log("🔄 Running daily grocery item status check...");

    const groceryItems = await GroceryItem.findAll();
    const today = new Date();
    const token = "YOUR_AUTH_TOKEN"; // Get dynamically if needed

    for (const item of groceryItems) {
      const expiryDate = new Date(item.expiry_date);
      const daysUntilExpiry = Math.floor(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );
      let status = "active";

      if (daysUntilExpiry <= 2) {
        status = "expiring";
      } else if (daysUntilExpiry <= 7) {
        status = "active";
      } else if (daysUntilExpiry < 0) {
        status = "expired";
      }

      // If quantity is 0, mark as "used"
      if (item.available_quantity === 0) {
        status = "used";
      }

      // Update item status in database
      await GroceryItem.update({ status }, { where: { id: item.id } });

      console.log(`✅ Updated status of '${item.name}' to '${status}'`);

      // If expired, push to wastage database
      if (status === "expired") {
        await addWastage(item, token);
      }
    }

    console.log("✅ Grocery item check completed!");
  } catch (error) {
    console.error("❌ Error in grocery item check:", error.message);
  }
}

// Run every 24 hours
setInterval(checkAndUpdateGroceryItems, CHECK_INTERVAL);
