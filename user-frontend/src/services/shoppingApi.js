// services/shoppingApi.js
import { shoppingAPI } from '../api/api';

const getAuthHeader = (token) => {
  // Make sure token exists and is properly formatted
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  // Check if token already has 'Bearer' prefix
  if (!token.startsWith('Bearer ')) {
    token = `Bearer ${token}`;
  }
  
  return {
    Authorization: token,
  };
};

export const createShoppingList = async (name, token) => {
  try {
    console.log('Using token:', token); // Debugging
    const response = await shoppingAPI.post(
      '/shopping-lists',
      { name },
      { headers: getAuthHeader(token) }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message); // Debugging
    throw error.response?.data || new Error('Network Error');
  }
};

export const getAllShoppingLists = async (token) => {
  try {
    console.log('Using token:', token); // Debugging
    const response = await shoppingAPI.get('/shopping-lists', {
      headers: getAuthHeader(token),
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message); // Debugging
    throw error.response?.data || new Error('Network Error');
  }
};

export const updateShoppingList = async (listId, updateData, token) => {
  try {
    const response = await shoppingAPI.put(
      `/shopping-lists/${listId}`,
      updateData,
      { headers: getAuthHeader(token) }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Network Error');
  }
};

export const deleteShoppingList = async (listId, token) => {
  try {
    const response = await shoppingAPI.delete(
      `/shopping-lists/${listId}`,
      { headers: getAuthHeader(token) }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Network Error');
  }
};