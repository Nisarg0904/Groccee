const GroceryItem = require("../models/grocery_item");
const {
  validateItem,
  updatePackagingMetrics,
  getItemById,
  getWastageByItemIdPublic,
} = require("../utils/apiHelper"); // ✅ Import updateUserItem
const { Op, Sequelize } = require("sequelize");
const moment = require("moment-timezone");
const axios = require("axios");


// ✅ Add Grocery Item and Update `times_bought`
async function createGroceryItem(req, res) {
  try {
    const {
      name,
      unit,
      category,
      purchased_quantity,
      price,
      expiry_date, // Expected in YYYY-MM-DD format
    } = req.body;

    const user_id = req.user.id;
    const token = req.header("Authorization").split(" ")[1]; // Extract token from header

    // Step 1: Validate or Create Item, Get item_id
    const item = await validateItem(name, { unit }, category, token);

    if (!item || !item._id) {
      throw new Error("Invalid item returned from validation.");
    }
    console.log("🟢 Validated Item:", item);

    // Step 2: Calculate Price per Unit
    const price_per_unit = price / purchased_quantity;

    // Step 3: Set Purchased Date (Today’s Date)
    const userTimeZone = "America/Toronto"; // Adjust based on user location
    const purchased_date = moment().tz(userTimeZone).format("YYYY-MM-DD");

    // Step 4: Determine Status Based on Expiry Date
    let status = "fresh"; // Default status
    if (expiry_date) {
      const today = moment().tz(userTimeZone);
      const expiryMoment = moment(expiry_date, "YYYY-MM-DD").tz(userTimeZone);
      const daysUntilExpiry = expiryMoment.diff(today, "days");

      if (daysUntilExpiry <= 2) {
        status = "expiring";
      } else if (daysUntilExpiry <= 7) {
        status = "active";
      } else if (daysUntilExpiry < 0) {
        status = "expired";
      }
    }

    // Step 5: Create Grocery Item in Database
    const groceryItem = await GroceryItem.create({
      item_id: item._id,
      name,
      user_id,
      unit,
      purchased_quantity,
      available_quantity: purchased_quantity, // Initial available = purchased
      price,
      price_per_unit,
      expiry_date,
      purchased_date,
      status,
    });

    // Step 6: ✅ Increase `times_bought` for that specific unit
    const packaging = item.packaging.find((pack) => pack.unit === unit);

    if (packaging) {
      console.log(`🟡 Increasing times_bought for '${unit}' (ID: ${item._id})`);

      // ✅ Call API to update only `times_bought`
      await updatePackagingMetrics(
        item._id,
        unit,
        packaging.times_bought + 1,
        null,
        token
      );
    } else {
      console.warn(
        `⚠️ Packaging unit '${unit}' not found for item '${name}', skipping update.`
      );
    }

    return res.status(201).json({
      groceryItem,
      message: "Grocery item successfully added, and times_bought updated.",
    });
  } catch (error) {
    console.error("❌ Error adding grocery item:", error.message);
    return res.status(400).json({ message: error.message });
  }
}




// ✅ Get all grocery items for the authenticated user
async function getAllUserGroceries(req, res) {
  try {
    const groceryItems = await GroceryItem.findAll({
      where: { user_id: req.user.id }, // Fetch items specific to the user
    });

    res.status(200).json(groceryItems);
  } catch (error) {
    console.error("Error fetching grocery items:", error.message);
    res.status(500).json({ message: "Failed to fetch grocery items" });
  }
}

// ✅ Get a grocery item by ID
async function getGroceryItemById(req, res) {
  const { id } = req.params;

  try {
    const groceryItem = await GroceryItem.findByPk(id);

    if (!groceryItem) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.status(200).json(groceryItem);
  } catch (error) {
    console.error("Error fetching grocery item:", error.message);
    res.status(500).json({ message: "Failed to fetch grocery item" });
  }
}


/**
 * Process a grocery item with status 'used': gather purchase history, item details, wastage records,
 * compute average buying period, bundle the data, and send it to the ML endpoint.
 * @param {object} item - The grocery item that was updated.
 */
async function processUsedItem(item) {
  try {
    // Retrieve purchase history for the same item_id and user.
    const purchaseHistory = await GroceryItem.findAll({
      where: { item_id: item.item_id, user_id: item.user_id },
    });

    // Get the item details using a public API endpoint.
    const itemDetails = await getItemById(item.item_id);

    // Get wastage records using a public API endpoint.
    const wasteHistory = await getWastageByItemIdPublic(item.item_id);

    // Compute the average buying period (in days) if there are multiple purchase records.
    let averageBuyingPeriod = 0;
    if (purchaseHistory.length > 1) {
      // Sort by purchased_date in ascending order.
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

    // Bundle up the data in the desired format.
    const payload = {
      user_id: item.user_id,
      item_id: item.item_id,
      packaging_unit: item.unit, // Alternatively, you can derive this from itemDetails.packaging.
      purchaseHistory,
      itemDetails,
      wasteHistory,
      name: item.name, // Using the grocery item's name.
      category: itemDetails.category,
      averageBuyingPeriod,
    };

    // Send the bundled data via a PUT request to the ML endpoint.
    await axios.put("http://localhost:5005/api/userPreference/ml", payload);
    console.log(`✅ Sent user preference data for used item ${item.item_id}`);
  } catch (error) {
    console.error(
      `❌ Error processing used item ${item.item_id}:`,
      error.message
    );
  }
}

/**
 * API endpoint to update a grocery item.
 * If the status is set (or auto-set) to 'used', process the item to send its history data to the ML endpoint.
 */
async function updateGroceryItem(req, res) {
  const { id } = req.params;
  const { available_quantity, expiry_date, price, status } = req.body; // Include status in destructuring

  try {
    const user_id = req.user.id;

    if (!available_quantity && !expiry_date && !price && !status) {
      return res
        .status(400)
        .json({ message: "Please provide fields to update." });
    }

    // Build the payload for update.
    const updatePayload = {};
    if (available_quantity !== undefined)
      updatePayload.available_quantity = available_quantity;
    if (expiry_date !== undefined) updatePayload.expiry_date = expiry_date;
    if (price !== undefined) updatePayload.price = price;
    if (status !== undefined) updatePayload.status = status; // Include status if provided

    // Automatic status update: if available_quantity is 0, mark as 'used'
    if (available_quantity === 0) {
      updatePayload.status = "used";
    }

    // Update the grocery item in the database.
    const updated = await GroceryItem.update(updatePayload, {
      where: { id: id, user_id: user_id },
    });

    if (!updated[0]) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    // Retrieve the updated item to have the complete record.
    const updatedItem = await GroceryItem.findOne({
      where: { id: id, user_id: user_id },
    });

    // If the item's status is 'used', process its history and send data to the ML endpoint.
    if (updatePayload.status === "used") {
      await processUsedItem(updatedItem);
    }

    res.status(200).json({ message: "Grocery item updated successfully" });
  } catch (error) {
    console.error("Error updating grocery item:", error.message);
    res.status(500).json({ message: "Failed to update grocery item" });
  }
}



// ✅ Delete a grocery item
async function deleteGroceryItem(req, res) {
  const { id } = req.params;

  try {
    const deleted = await GroceryItem.destroy({
      where: { id: id }, // Use `id` instead of `grocery_item_id`
    });

    if (!deleted) {
      return res.status(404).json({ message: "Grocery item not found" });
    }

    res.status(200).json({ message: "Grocery item deleted successfully" });
  } catch (error) {
    console.error("Error deleting grocery item:", error.message);
    res.status(500).json({ message: "Failed to delete grocery item" });
  }
}

// ✅ Get groceries by status (expired, expiring, active, fresh)
async function getGroceriesByStatus(req, res) {
  try {
    const { status } = req.query; // Get status from query parameter

    if (!["expired", "expiring", "active", "fresh"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use expired, expiring, active, or fresh.",
      });
    }

    const groceryItems = await GroceryItem.findAll({
      where: {
        user_id: req.user.id, // Fetch groceries for the logged-in user
        status: status, // Filter by status
      },
    });

    if (groceryItems.length === 0) {
      return res
        .status(404)
        .json({ message: `No grocery items found with status '${status}'.` });
    }

    res.status(200).json(groceryItems);
  } catch (error) {
    console.error("Error fetching groceries by status:", error.message);
    res.status(500).json({ message: "Failed to fetch groceries by status" });
  }
}

/**
 * ✅ Manually update grocery item status
 */
async function updateItemStatus(req, res) {
  try {
    const { item_id, status } = req.body;

    const item = await GroceryItem.findByPk(item_id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.status = status;
    await item.save();

    res.status(200).json({ message: "Item status updated", item });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating item status", error: error.message });
  }
}


// New method to fetch past grocery records for a given item id
async function getPastGroceriesForItem(req, res) {
  try {
    const { item_id } = req.params;
    if (!item_id) {
      return res.status(400).json({ message: "Item id is required." });
    }
    
    // Set today's date (start of day for comparison)
    const today = moment().startOf('day').toDate();

    // Retrieve past grocery records for this item:
    // Include records where status is "used" OR the expiry_date is before today.
    const pastGroceries = await GroceryItem.findAll({
      where: {
        item_id,                          // Matches the passed item id
        user_id: req.user.id,             // Only for the authenticated user
        [Op.or]: [
          { status: 'used' },
          { expiry_date: { [Op.lt]: today } }
        ]
      }
    });

    // Import helper methods on-demand (if not imported at the top)
    const { getItemById, getWastageByItemIdPublic } = require("../utils/apiHelper");

    // Fetch item details and wastage records using the helper methods
    const itemDetails = await getItemById(item_id);
    const wastageRecords = await getWastageByItemIdPublic(item_id);

    // Build the response JSON model
    const responseModel = {
      itemDetails,
      pastGroceries,
      wastageRecords,
    };

    return res.status(200).json(responseModel);
  } catch (error) {
    console.error("Error fetching past groceries for item:", error.message);
    return res.status(500).json({ message: "Failed to fetch past groceries for item" });
  }
}
// ✅ Export all controller methods correctly
module.exports = {
  createGroceryItem,
  getAllUserGroceries,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  getGroceriesByStatus, // ✅ Handles expired, expiring, active, fresh
  updateItemStatus,
  getPastGroceriesForItem, // ✅ Now correctly included in exports
};
