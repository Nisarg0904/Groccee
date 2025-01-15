const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController'); 


router.post('/', recipeController.createRecipe);
router.get('/', recipeController.getAllRecipes);
router.get('/:id', recipeController.getRecipeById);
router.put('/:id', recipeController.updateRecipeById);
router.delete('/:id', recipeController.deleteRecipeById);

module.exports = router;
