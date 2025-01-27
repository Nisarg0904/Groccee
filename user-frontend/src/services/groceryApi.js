import { groceryAPI } from "./api";

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
export const fetchGroceries = async (token,) => {
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
