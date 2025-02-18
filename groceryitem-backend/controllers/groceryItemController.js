const GroceryItem = require("../models/grocery_item");
const { validateItem, updatePackagingMetrics } = require("../utils/apiHelper"); // ✅ Import updateUserItem
const { Op, Sequelize } = require("sequelize");
const moment = require("moment-timezone");


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

// ✅ Update a grocery item
async function updateGroceryItem(req, res) {
  const { id } = req.params; // Grocery item ID
  const { available_quantity, expiry_date, price } = req.body; // Fields to update

  try {
    const user_id = req.user.id; // Get user ID from token

    if (!available_quantity && !expiry_date && !price) {
      return res
        .status(400)
        .json({ message: "Please provide fields to update." });
    }

    const updatePayload = {};
    if (available_quantity !== undefined)
      updatePayload.available_quantity = available_quantity;
    if (expiry_date !== undefined) updatePayload.expiry_date = expiry_date;
    if (price !== undefined) updatePayload.price = price;

    // Update the grocery item for the authenticated user
    const updated = await GroceryItem.update(updatePayload, {
      where: {
        id: id, // Use `id` as per the new model
        user_id: user_id, // Ensure the user owns the item
      },
    });

    if (!updated[0]) {
      return res.status(404).json({ message: "Grocery item not found" });
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

// ✅ Export all controller methods correctly
module.exports = {
  createGroceryItem,
  getAllUserGroceries,
  getGroceryItemById,
  updateGroceryItem,
  deleteGroceryItem,
  getGroceriesByStatus, // ✅ Handles expired, expiring, active, fresh
  updateItemStatus, // ✅ Now correctly included in exports
};
