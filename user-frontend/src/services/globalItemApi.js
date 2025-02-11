// services/globalItemsApi.js
import { globalItemAPI } from '../api/api';

export const searchItems = async (searchTerm) => {
  if (!searchTerm || searchTerm.length < 2) return [];
  
  try {
    // Using the getItemByName endpoint
    const response = await globalItemAPI.get(`/global/items/name/${encodeURIComponent(searchTerm)}`);
    // Since your backend returns a single item, wrap it in an array if it exists
    const data = response.data;
    return data ? [data] : [];
  } catch (error) {
    console.error('Error searching items:', error.response?.data || error.message);
    return []; // Return empty array instead of throwing
  }
};

export const getItemsByCategory = async (category) => {
  try {
    const response = await globalItemAPI.get(`/global/items/category/${encodeURIComponent(category)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items by category:', error.message);
    return [];
  }
};

export const getAllCategories = async () => {
  try {
    const response = await globalItemAPI.get('/global/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    return [];
  }
};

export const getItemDetails = async (itemName) => {
  try {
    const response = await globalItemAPI.get(`/global/items/name/${encodeURIComponent(itemName)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item details:', error.message);
    return null;
  }
};