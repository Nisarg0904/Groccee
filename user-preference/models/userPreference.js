const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
  userId: {
    type: Number, 
    required: true,
  },
  likedItemId: {
    type: String, 
  },
  dislikedItemId: {
    type: String, 
  },
  mostCookedRecipeId: {
    type: String, 
  },
  interactionFrequency: { // how many times user have interact with the particular item
    type: Number,
    default: 0,
  },
  itemCategory: {
    type: String,
    enum: ['Dairy', 'Vegetables', 'Snacks', 'Grains', 'Meat', 'Other'],
    default: 'Other',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


userPreferenceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserPreference = mongoose.model('UserPreference', userPreferenceSchema);

module.exports = UserPreference;
