import { itemAPI } from "./api";

// Fetch all items
export const fetchItems = async (token) => {
  try {
    const response = await itemAPI.get("/items", {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token here
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch an item by ID
export const fetchItemById = async (id, token) => {
  try {
    const response = await itemAPI.get(`/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pass token here
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};