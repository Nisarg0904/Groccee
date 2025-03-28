import { groceryAPI, globalItemAPI } from "./api";

// Fetch suggested items based on user input
export const fetchSuggestedItems = async (query) => {
  try {
    const response = await globalItemAPI.get(`/global/search/${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested items:", error);
    return [];
  }
};

// Fetch suggested units based on user input
export const fetchSuggestedUnits = async (query) => {
  try {
    const response = await globalItemAPI.get(`/global/search/units/${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested units:", error);
    return [];
  }
};

// Fetch suggested categories based on user input
export const fetchSuggestedCategories = async (query) => {
  try {
    const response = await globalItemAPI.get(
      `/global/search/categories/${query}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested categories:", error);
    return [];
  }
};

// Add a new grocery item
export const addGroceryItem = async (token, groceryData) => {
  try {
    const response = await groceryAPI.post("/groceryitems", groceryData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch all grocery items
export const fetchGroceries = async (token) => {
  try {
    const response = await groceryAPI.get("/groceryitems", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetchGroceries:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Update a grocery item
export const updateGroceryItem = async (token, id, updatedData) => {
  try {
    const response = await groceryAPI.put(`/groceryitems/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Delete a grocery item
export const deleteGroceryItem = async (token, id) => {
  try {
    const response = await groceryAPI.delete(`/groceryitems/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Add this new function to your existing groceryApi.js
export const getPantryOverview = async (token) => {
  try {
    const response = await groceryAPI.get("/groceryitems", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pantry overview:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// In groceryApi.js:
// import { groceryAPI } from "./api";

export async function getGroceriesByStatus(token, status) {
  // Example: GET /groceryitems/status?status=expired or expiring
  const response = await groceryAPI.get(`/groceryitems/status?status=${status}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // array of items
}
