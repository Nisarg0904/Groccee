import { itemAPI } from "../api/api";


// Fetch all items
export const fetchItems = async () => {
  try {
    const response = await itemAPI.get("/items");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch an item by ID
export const fetchItemById = async (id) => {
  try {
    const response = await itemAPI.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
