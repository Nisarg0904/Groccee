const express = require("express");
const router = express.Router();
const {
  // createSuggestedItem,
  getAllItems,
  getItemByName,
  getItemsByCategory,
  getItemsByUnit,
  getAllCategories,
  searchItemsByName,
  searchUnitsByQuery,
  searchCategoriesByQuery,
} = require("../controllers/globalItemController");

// Define routes
// router.post("/", createSuggestedItem)
router.get("/", getAllItems);
router.get("/name/:name", getItemByName);
router.get("/category/:category", getItemsByCategory);
router.get("/unit/:unit", getItemsByUnit);
router.get("/categories", getAllCategories);
router.get("/search/:query", searchItemsByName);
router.get("/search/units/:query", searchUnitsByQuery); // New route for unit search
router.get("/search/categories/:query", searchCategoriesByQuery); // New route for category search

module.exports = router;
