const mongoose = require('mongoose');
const { INTEGER } = require('sequelize');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true },
    },
  ],
  instructions: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
  },
  preparationTime: {
    type: Number, // In minutes
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user_id:{
    type: Number,
    required:true,
  }
});

module.exports = mongoose.model('Recipe', recipeSchema);
