const Item = require("../models/Item");

const createUserItem = async (req, res) => {
    try {
        const { name, category, selected_unit } = req.body;
        const user_id = req.user.id; // Get user ID from JWT

        // Validate request body
        if (!name || !category || !selected_unit) {
            return res.status(400).json({ message: "Name, category, and selected_unit are required." });
        }

        // Check if the item already exists for the user
        let existingItem = await Item.findOne({ name, user_id });

        if (existingItem) {
            // Ensure `packaging` is an array before accessing it
            if (!Array.isArray(existingItem.packaging)) {
                existingItem.packaging = [];
            }

            // Check if the selected unit already exists in the packaging array
            const unitExists = existingItem.packaging.some(pack => pack.unit === selected_unit);

            if (unitExists) {
                return res.status(400).json({ message: `Unit '${selected_unit}' already exists for '${name}'.` });
            }

            // Add new packaging as a separate object inside the array
            existingItem.packaging.push({
                unit: selected_unit,
                times_bought: 0,
                times_wasted: 0
            });

            await existingItem.save();

            return res.status(200).json({ 
                message: `Added new packaging '${selected_unit}' for '${name}'.`, 
                item: existingItem 
            });
        }

        // Create a new user-specific item if it does not exist
        const newItem = new Item({
            name,
            category,
            user_id,
            packaging: [
                {
                    unit: selected_unit,
                    times_bought: 0,
                    times_wasted: 0,
                }
            ]
        });

        await newItem.save();

        return res.status(201).json({ message: "User item created successfully.", item: newItem });

    } catch (error) {
        console.error("Error creating user item:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
const updateUserItem = async (req, res) => {
    try {
        const { name, new_name, category, packaging } = req.body;
        const user_id = req.user.id; // Get user ID from JWT

        // Validate request body
        if (!name) {
            return res.status(400).json({ message: "Item name is required." });
        }

        // Find the existing item for the user
        let existingItem = await Item.findOne({ name, user_id });

        if (!existingItem) {
            return res.status(404).json({ message: `Item '${name}' not found for this user.` });
        }

        // Update `name` if provided
        if (new_name) {
            existingItem.name = new_name;
        }

        // Update `category` if provided
        if (category) {
            existingItem.category = category;
        }

        // Update `packaging` array if provided
        if (packaging && Array.isArray(packaging)) {
            packaging.forEach(newPackage => {
                const existingPackageIndex = existingItem.packaging.findIndex(pack => pack.unit === newPackage.unit);

                if (existingPackageIndex !== -1) {
                    // Update `times_bought` and `times_wasted` if provided
                    if (newPackage.times_bought !== undefined) {
                        existingItem.packaging[existingPackageIndex].times_bought = newPackage.times_bought;
                    }
                    if (newPackage.times_wasted !== undefined) {
                        existingItem.packaging[existingPackageIndex].times_wasted = newPackage.times_wasted;
                    }
                } else {
                    // Add new packaging if `unit` does not exist
                    existingItem.packaging.push({
                        unit: newPackage.unit,
                        times_bought: newPackage.times_bought || 0,
                        times_wasted: newPackage.times_wasted || 0
                    });
                }
            });
        }

        await existingItem.save();

        return res.status(200).json({ 
            message: `Item '${existingItem.name}' updated successfully.`,
            item: existingItem 
        });

    } catch (error) {
        console.error("Error updating user item:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const addOrUpdateUserItem = async (req, res) => {
    try {
        const { name, category, selected_unit } = req.body;
        const user_id = req.user.id; // Get user ID from JWT

        // Validate request body
        if (!name || !category || !selected_unit) {
            return res.status(400).json({ message: "Name, category, and selected_unit are required." });
        }

        // Check if the item exists for the user
        let existingItem = await Item.findOne({ name, user_id });

        if (!existingItem) {
            // If item does not exist, create a new item
            const newItem = new Item({
                name,
                category,
                user_id,
                packaging: [
                    {
                        unit: selected_unit,
                        times_bought: 1, // Start with 1 purchase
                        times_wasted: 0
                    }
                ]
            });

            await newItem.save();
            return res.status(201).json({ 
                message: "New item created with packaging.", 
                item_id: newItem._id, // Return item ID
                item: newItem 
            });
        }

        // Ensure `packaging` is an array
        if (!Array.isArray(existingItem.packaging)) {
            existingItem.packaging = [];
        }

        // Check if the selected unit already exists in the packaging array
        const existingPackaging = existingItem.packaging.find(pack => pack.unit === selected_unit);

        if (existingPackaging) {
            // If the packaging unit exists, increase `times_bought`
            existingPackaging.times_bought += 1;
        } else {
            // If the packaging unit does not exist, add a new packaging entry
            existingItem.packaging.push({
                unit: selected_unit,
                times_bought: 1, // Start with 1 purchase
                times_wasted: 0
            });
        }

        await existingItem.save();

        return res.status(200).json({ 
            message: existingPackaging ? 
                `Updated times_bought for '${selected_unit}' of '${name}'.` : 
                `Added new packaging '${selected_unit}' for '${name}'.`, 
            item_id: existingItem._id, // Return item ID
            item: existingItem 
        });

    } catch (error) {
        console.error("Error adding/updating user item:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const checkItemExists = async (req, res) => {
  try {
    const { name, unit } = req.query;
    const user_id = req.user.id; // Get user ID from JWT

    if (!name || !unit) {
      return res
        .status(400)
        .json({ message: "Item name and packaging unit are required." });
    }

    // 🔹 Use case-insensitive regex search for item name
    const existingItem = await Item.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive match
      user_id,
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found." });
    }

    // 🔹 Ensure `packaging` array exists
    if (!existingItem.packaging || !Array.isArray(existingItem.packaging)) {
      return res.status(404).json({ message: "Item has no packaging data." });
    }

    console.log("🔍 Existing Packaging:", existingItem.packaging);

    // 🔹 Normalize `unit` values (trim spaces & lowercase)
    const normalizedUnit = unit.trim().toLowerCase();
    const packagingExists = existingItem.packaging.some(
      (pack) => pack.unit.trim().toLowerCase() === normalizedUnit
    );

    if (!packagingExists) {
      return res
        .status(404)
        .json({ message: `Packaging unit '${unit}' not found for this item.` });
    }

    return res.status(200).json({ item: existingItem });
  } catch (error) {
    console.error("Error checking item existence:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const getItemByName = async (req, res) => {
    try {
      const { name } = req.params;
      const user_id = req.user.id; // Get user ID from JWT
  
      if (!name) {
        return res.status(400).json({ message: "Item name is required." });
      }
  
      // 🔹 Use case-insensitive regex search for item name
      const item = await Item.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive match
        user_id,
      });
  
      if (!item) {
        return res.status(404).json({ message: `Item '${name}' not found.` });
      }
  
      res.status(200).json(item);
    } catch (error) {
      console.error("Error fetching item by name:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  const getAllUserItems = async (req, res) => {
    try {
      const user_id = req.user.id; // Get user ID from JWT

      // Fetch all items belonging to the user
      const items = await Item.find({ user_id });

      if (!items.length) {
        return res
          .status(404)
          .json({ message: "No items found for this user." });
      }

      return res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const updatePackagingMetrics = async (req, res) => {
    try {
      const { item_id, unit, times_bought, times_wasted } = req.body;
      const user_id = req.user.id; // Get user ID from JWT

      // Validate request body
      if (!item_id || !unit) {
        return res
          .status(400)
          .json({ message: "Item ID and unit are required." });
      }

      // Find the item by ID and ensure it belongs to the user
      let existingItem = await Item.findOne({ _id: item_id, user_id });

      if (!existingItem) {
        return res
          .status(404)
          .json({ message: `Item not found for this user.` });
      }

      // Ensure `packaging` exists and is an array
      if (!Array.isArray(existingItem.packaging)) {
        return res.status(400).json({ message: "Item has no packaging data." });
      }

      // Find the specific packaging by unit
      const packagingIndex = existingItem.packaging.findIndex(
        (pack) => pack.unit === unit
      );

      if (packagingIndex === -1) {
        return res
          .status(404)
          .json({
            message: `Packaging unit '${unit}' not found for this item.`,
          });
      }

      // Update times_bought if provided
      if (times_bought !== undefined) {
        existingItem.packaging[packagingIndex].times_bought = times_bought;
      }

      // Update times_wasted if provided
      if (times_wasted !== undefined) {
        existingItem.packaging[packagingIndex].times_wasted = times_wasted;
      }

      // Save the updated item
      await existingItem.save();

      return res.status(200).json({
        message: `Updated packaging metrics for unit '${unit}'.`,
        item: existingItem,
      });
    } catch (error) {
      console.error("Error updating packaging metrics:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  module.exports = {
    getItemByName,
    createUserItem,
    updateUserItem,
    addOrUpdateUserItem,
    checkItemExists,
    getAllUserItems,
    updatePackagingMetrics, // ✅ New method added
  };
