const axios = require("axios");

const USER_BACKEND_URL =
  process.env.USER_BACKEND_URL || "http://localhost:5000";
const ITEM_BACKEND_URL =
  process.env.ITEM_BACKEND_URL || "http://localhost:5006";
const GROCERYITEM_BACKEND_URL =
  process.env.SHOPPING_LIST_BACKEND_URL || "http://localhost:5002";

const WASTAGE_BACKEND_URL =
  process.env.WASTAGE_BACKEND_URL || "http://localhost:5003"; // Change to your actual wastage service URL


  