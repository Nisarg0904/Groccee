import { wastageAPI } from "./api";

// ✅ Fetch Wastage Items using token from `UserContext`
export const getWastageItems = async (token) => {
  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await wastageAPI.get("/wastage", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching wastage records:", error.message);
    throw error;
  }
};
