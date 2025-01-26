const UserPreference = require('../models/userPreference');
const { validateUserId, validateItemId, validateRecipeId } = require('../utils/apiHelper');

// Create a new User Preference
async function createUserPreference(req, res) {
    try {
      const preference = req.body;
  
      // Destructure all fields from the request body
      const { 
        userId, 
        likedItemId, 
        dislikedItemId, 
        mostCookedRecipeId, 
        interactionFrequency, 
        itemCategory 
      } = preference;
  
      // Validate User ID (PostgreSQL)
      const userValid = await validateUserId(userId);
      if (!userValid) throw new Error('Invalid userId: User does not exist.');
  
      // Validate likedItemId (MongoDB)
      const likedItemValid = likedItemId ? await validateItemId(likedItemId) : true;
      if (!likedItemValid) throw new Error('Invalid likedItemId: Item does not exist.');
  
      // Validate dislikedItemId (MongoDB)
      const dislikedItemValid = dislikedItemId ? await validateItemId(dislikedItemId) : true;
      if (!dislikedItemValid) throw new Error('Invalid dislikedItemId: Item does not exist.');
  
      // Validate mostCookedRecipeId (MongoDB)
      const recipeValid = mostCookedRecipeId ? await validateRecipeId(mostCookedRecipeId) : true;
      if (!recipeValid) throw new Error('Invalid mostCookedRecipeId: Recipe does not exist.');
  
      // Validate interactionFrequency (Number)
      if (interactionFrequency < 0) {
        throw new Error('Invalid interactionFrequency: Cannot be negative.');
      }
  
      // Validate itemCategory (Enum)
      const validCategories = ['Dairy', 'Vegetables', 'Snacks', 'Grains', 'Meat', 'Other'];
      if (itemCategory && !validCategories.includes(itemCategory)) {
        throw new Error(`Invalid itemCategory: Must be one of ${validCategories.join(', ')}.`);
      }
  
      const newPreference = new UserPreference(preference);
      const savedPreference = await newPreference.save();
  
      res.status(201).json(savedPreference);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  

// Get all User Preferences
async function getAllUserPreferences(req, res) {
  try {
    const preferences = await UserPreference.find();
    res.status(200).json(preferences);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a single User Preference by ID
async function getUserPreferenceById(req, res) {
  try {
    const { id } = req.params;

    const preference = await UserPreference.findById(id);
    if (!preference) {
      return res.status(404).json({ error: 'User Preference not found' });
    }

    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a User Preference by ID
async function updateUserPreference(req, res) {
    try {
      const { id } = req.params; 
      const updates = req.body; 
  
      const {
        userId,
        likedItemId,
        dislikedItemId,
        mostCookedRecipeId,
        interactionFrequency,
        itemCategory,
      } = updates;
  

      if (userId) {
        const userValid = await validateUserId(userId);
        if (!userValid) throw new Error('Invalid userId: User does not exist.');
      }
  
      if (likedItemId) {
        const likedItemValid = await validateItemId(likedItemId);
        if (!likedItemValid) throw new Error('Invalid likedItemId: Item does not exist.');
      }
  
      if (dislikedItemId) {
        const dislikedItemValid = await validateItemId(dislikedItemId);
        if (!dislikedItemValid) throw new Error('Invalid dislikedItemId: Item does not exist.');
      }
  
      if (mostCookedRecipeId) {
        const recipeValid = await validateRecipeId(mostCookedRecipeId);
        if (!recipeValid) throw new Error('Invalid mostCookedRecipeId: Recipe does not exist.');
      }
  
      if (interactionFrequency !== undefined) {
        if (interactionFrequency < 0) {
          throw new Error('Invalid interactionFrequency: Cannot be negative.');
        }
      }
  
      if (itemCategory) {
        const validCategories = ['Dairy', 'Vegetables', 'Snacks', 'Grains', 'Meat', 'Other'];
        if (!validCategories.includes(itemCategory)) {
          throw new Error(`Invalid itemCategory: Must be one of ${validCategories.join(', ')}.`);
        }
      }
  
      // Perform the update in MongoDB
      const updatedPreference = await UserPreference.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedPreference) {
        return res.status(404).json({ error: 'User Preference not found' });
      }
  
      res.status(200).json(updatedPreference); 
    } catch (error) {
      res.status(400).json({ error: error.message }); 
    }
  }
  

// Delete a User Preference by ID
async function deleteUserPreference(req, res) {
  try {
    const { id } = req.params;

    const deletedPreference = await UserPreference.findByIdAndDelete(id);
    if (!deletedPreference) {
      return res.status(404).json({ error: 'User Preference not found' });
    }

    res.status(200).json({ message: 'User Preference deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createUserPreference,
  getAllUserPreferences,
  getUserPreferenceById,
  updateUserPreference,
  deleteUserPreference,
};
