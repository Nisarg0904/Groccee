const express = require("express");
const router = express.Router();
const {
    // createSuggestedItem,
    getAllItems,
    getItemByName,
    getItemsByCategory,
    getItemsByUnit,
    getAllCategories
} = require("../controllers/globalItemController");

// Define routes
// router.post("/", createSuggestedItem)
router.get("/", getAllItems);
router.get("/name/:name", getItemByName);
router.get("/category/:category", getItemsByCategory);
router.get("/unit/:unit", getItemsByUnit);
router.get("/categories", getAllCategories);

module.exports = router;
