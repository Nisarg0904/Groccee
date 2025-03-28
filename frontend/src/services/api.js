import axios from "axios";

// Base URL configurations
const userAPI = axios.create({
  baseURL: "http://10.0.2.2:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const groceryAPI = axios.create({
  baseURL: "http://10.0.2.2:5004/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const itemAPI = axios.create({
  baseURL: "http://10.0.2.2:5006/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add shopping API
const shoppingAPI = axios.create({
  baseURL: "http://10.0.2.2:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add shopping API
const shoppingItemAPI = axios.create({
  baseURL: "http://10.0.2.2:5002/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const wastageAPI = axios.create({
  baseURL: "http://10.0.2.2:5003/api",
  headers: {
    "Content-Type": "application/json",
  },
});
const globalItemAPI = axios.create({
  baseURL: "http://10.0.2.2:5010/api", // Update with correct port if needed
  headers: {
    "Content-Type": "application/json",
  },
});
const recipeAPI = axios.create({
  baseURL: "http://10.0.2.2:5007/api", // Update with correct port if needed
  headers: {
    "Content-Type": "application/json",
  },
});

export {
  userAPI,
  groceryAPI,
  itemAPI,
  shoppingAPI,
  shoppingItemAPI,
  wastageAPI,
  globalItemAPI,
  recipeAPI,
};