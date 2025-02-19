import { wastageAPI } from "./api";

// Create a new wastage entry
export const createWastage = async (data, token) => {
  try {
    const response = await wastageAPI.post("/wastage/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch all wastage records
export const fetchAllWastage = async (token) => {
  try {
    const response = await wastageAPI.get("/wastage/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error - fetchAllWastage:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch wastage by ID
export const fetchWastageById = async (id, token) => {
  try {
    const response = await wastageAPI.get(`/wastage/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch wastage by item ID
export const fetchWastageByItemId = async (item_id, token) => {
  try {
    const response = await wastageAPI.get(`/wastage/item/${item_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch wastage by date
export const fetchWastageByDate = async (date, token) => {
  try {
    // Encode date to ensure URL compatibility
    const encodedDate = encodeURIComponent(date);

    const response = await wastageAPI.get(`/wastage/date/${encodedDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch wastage by category
export const fetchWastageByCategory = async (category, token) => {
  try {
    const response = await wastageAPI.get(`/wastage/category/${category}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch total wasted amount for an item
export const fetchTotalWastedAmountForItem = async (item_id, token) => {
  try {
    const response = await wastageAPI.get(`/wastage/total/item/${item_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch total wasted amount for a category
export const fetchTotalWastedAmountForCategory = async (category, token) => {
  try {
    const response = await wastageAPI.get(
      `/wastage/total/category/${category}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
