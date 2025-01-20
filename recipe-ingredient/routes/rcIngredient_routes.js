const express = require('express');
const {
    createRecipeIngredient,
    getAllRecipeIngredients,
    getRecipeIngredientById,
    updateRecipeIngredient,
    deleteRecipeIngredient,
} = require('../controllers/rcIngredient_controller')

const router = express.Router();

router.post('/', createRecipeIngredient);
router.get('/', getAllRecipeIngredients);
router.get('/:id', getRecipeIngredientById);
router.put('/:id', updateRecipeIngredient);
router.delete('/:id', deleteRecipeIngredient);

module.exports = router;
