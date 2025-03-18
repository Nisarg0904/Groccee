const axios = require("axios");
const GroceryItem = require("./models/grocery_item");
const {
  addWastage,
  getItemById,
  getWastageByItemIdPublic,
} = require("./utils/apiHelper");

const CHECK_INTERVAL = 24 * 60 * 60 * 1000; // Runs once a day

/**
 * Process an expired grocery item: gather purchase history, item details, and wastage records,
 * compute average buying period, bundle the data, and send it to the ML endpoint.
 * @param {object} item - The expired grocery item.
 * @param {string} token - The system token.
 */
async function processExpiredItem(item, token) {
  try {
    // Get all transactions for this item (purchase history) for the same user.
    const purchaseHistory = await GroceryItem.findAll({
      where: { item_id: item.item_id, user_id: item.user_id },
    });

    // Get item details using a public endpoint (no token required).
    const itemDetails = await getItemById(item.item_id);

    // Get wastage records using a public endpoint.
    const wasteHistory = await getWastageByItemIdPublic(item.item_id);

    // Compute average buying period (in days) if there is more than one purchase record.
    let averageBuyingPeriod = 0;
    if (purchaseHistory.length > 1) {
      // Sort the history by purchased_date in ascending order.
      const sortedHistory = purchaseHistory.sort(
        (a, b) => new Date(a.purchased_date) - new Date(b.purchased_date)
      );
      let totalDiff = 0;
      for (let i = 1; i < sortedHistory.length; i++) {
        const date1 = new Date(sortedHistory[i - 1].purchased_date);
        const date2 = new Date(sortedHistory[i].purchased_date);
        const diff = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
        totalDiff += diff;
      }
      averageBuyingPeriod = totalDiff / (sortedHistory.length - 1);
    }

    // Bundle up data into the desired format.
    const payload = {
      user_id: item.user_id,
      item_id: item.item_id,
      packaging_unit: item.unit, // Or you could derive this from itemDetails.packaging if needed.
      purchaseHistory,
      itemDetails,
      wasteHistory,
      name: item.name, // Using grocery item's name (should match itemDetails.name)
      category: itemDetails.category,
      averageBuyingPeriod,
    };

    // Send a PUT request to the ML endpoint to update user preferences.
    await axios.put("http://localhost:5005/api/userPreference/ml", payload);
    console.log(`✅ Sent user preference data for item ${item.item_id}`);
  } catch (error) {
    console.error(
      `❌ Error processing expired item ${item.item_id}:`,
      error.message
    );
  }
}

/**
 * Check grocery items, update status, and move expired items to wastage.
 */
async function checkAndUpdateGroceryItems() {
  try {
    console.log("🔄 Running daily grocery item status check...");

    const groceryItems = await GroceryItem.findAll();
    const today = new Date();
    // Get the system token from environment variables (AUTH_TOKEN should be defined in your .env file)
    const token = process.env.AUTH_TOKEN;

    for (const item of groceryItems) {
      const expiryDate = new Date(item.expiry_date);
      const daysUntilExpiry = Math.floor(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );
      let status = "active";

      // Check for expired items first.
      if (daysUntilExpiry < 0) {
        status = "expired";
      } else if (daysUntilExpiry <= 2) {
        status = "expiring";
      } else if (daysUntilExpiry <= 7) {
        status = "active";
      }

      // If quantity is 0, mark as "used"
      if (item.available_quantity === 0) {
        status = "used";
      }

      // Update item status in the database.
      await GroceryItem.update({ status }, { where: { id: item.id } });
      console.log(`✅ Updated status of '${item.name}' to '${status}'`);

      // If the item is expired, add it to wastage and process further.
      if (status === "expired") {
        await addWastage(item, token);
        await processExpiredItem(item, token);
      }
    }

    console.log("✅ Grocery item check completed!");
  } catch (error) {
    console.error("❌ Error in grocery item check:", error.message);
  }
}

// Run every 24 hours
setInterval(checkAndUpdateGroceryItems, CHECK_INTERVAL);
