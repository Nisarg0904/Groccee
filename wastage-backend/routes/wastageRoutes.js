const express = require("express");
const wastageController = require("../controllers/wastageController");

const router = express.Router();

router.post("/", wastageController.createWastage);
router.get("/", wastageController.getAllWastage);
router.get("/:id", wastageController.getWastageById);
router.get("/item/:item_id", wastageController.getWastageByItemId);
router.get("/date/:date", wastageController.getWastageByDate);
router.get("/category/:category", wastageController.getWastageByCategory);
router.get(
  "/total/item/:item_id",
  wastageController.getTotalWastedAmountForItem
);
router.get(
  "/total/category/:category",
  wastageController.getTotalWastedAmountForCategory
);

module.exports = router;
