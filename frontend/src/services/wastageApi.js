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

// Fetch wastage by date range (for weekly and monthly views)
export const fetchWastageByDateRange = async (startDate, endDate, token) => {
  try {
    // Ensure dates are properly formatted as strings
    if (typeof startDate !== 'string' || typeof endDate !== 'string') {
      throw new Error("Date parameters must be strings in YYYY-MM-DD format");
    }
    
    // Use axios correctly with query parameters
    const response = await wastageAPI.get(`/wastage/daterange`, {
      params: {
        start: startDate,
        end: endDate
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error - fetchWastageByDateRange:', error);
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

// Fetch weekly wastage statistics
export const fetchWeeklyWastageStats = async (token) => {
  try {
    const response = await wastageAPI.get(`/wastage/stats/weekly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error - fetchWeeklyWastageStats:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch monthly wastage statistics
export const fetchMonthlyWastageStats = async (token) => {
  try {
    const response = await wastageAPI.get(`/wastage/stats/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error - fetchMonthlyWastageStats:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch wastage summary statistics (combines category, weekly, and monthly data)
export const fetchWastageSummary = async (token) => {
  try {
    const response = await wastageAPI.get(`/wastage/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error - fetchWastageSummary:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch current week's wastage
export const fetchCurrentWeekWastage = async (token) => {
  try {
    const response = await wastageAPI.get(`/wastage/current-week`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error - fetchCurrentWeekWastage:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Fetch current month's wastage
export const fetchCurrentMonthWastage = async (token) => {
  try {
    const response = await wastageAPI.get(`/wastage/current-month`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error - fetchCurrentMonthWastage:",
      error.response ? error.response.data : error.message
    );
    throw error.response ? error.response.data : new Error("Network Error");
  }
};