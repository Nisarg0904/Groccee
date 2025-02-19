const express = require("express");
const wastageController = require("../controllers/wastageController");
const authenticateUser = require("../middleware/authMiddleware"); // Import auth middleware

const router = express.Router();

router.post("/", authenticateUser, wastageController.createWastage);
router.get("/", authenticateUser, wastageController.getAllWastage);
router.get("/:id", authenticateUser, wastageController.getWastageById);
router.get(
  "/item/:item_id",
  authenticateUser,
  wastageController.getWastageByItemId
);
router.get("/date/:date", authenticateUser, wastageController.getWastageByDate);
router.get(
  "/category/:category",
  authenticateUser,
  wastageController.getWastageByCategory
);
router.get(
  "/total/item/:item_id",
  authenticateUser,
  wastageController.getTotalWastedAmountForItem
);
router.get(
  "/total/category/:category",
  authenticateUser,
  wastageController.getTotalWastedAmountForCategory
);

module.exports = router;
