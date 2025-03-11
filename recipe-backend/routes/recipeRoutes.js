// routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const { generateRecipes } = require("../controllers/recipeController");
const authenticateToken = require("../middleware/authMiddleware"); // Adjust path as needed

// POST /recipes/generate - Endpoint to generate recipes based on filtered grocery items
router.post("/generate", authenticateToken, generateRecipes);

module.exports = router;
