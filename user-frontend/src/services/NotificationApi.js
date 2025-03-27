// services/NotificationApi.js
import { groceryAPI } from '../api/api';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For tracking API calls to prevent duplicate requests
let apiCallsInProgress = {};

// Helper to manage in-progress API calls
const trackApiCall = (key, promise) => {
  if (apiCallsInProgress[key]) {
    return apiCallsInProgress[key];
  }
  
  apiCallsInProgress[key] = promise
    .finally(() => {
      delete apiCallsInProgress[key];
    });
    
  return apiCallsInProgress[key];
};

// Set the auth token for requests
export const setNotificationAuthToken = (token) => {
  if (!token) return;
  
  groceryAPI.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Add request interceptor to handle network errors
  groceryAPI.interceptors.request.use(
    config => {
      // You could add additional headers or params here
      return config;
    },
    error => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor to handle common errors
  groceryAPI.interceptors.response.use(
    response => response,
    error => {
      // Handle specific error cases
      if (error.message === 'Network Error') {
        console.error('Network connection issue. Please check your internet connection.');
      } else if (error.response) {
        // Handle specific HTTP status codes
        if (error.response.status === 401) {
          // Handle unauthorized - token expired
          console.error('Session expired. Please login again.');
          // You could trigger a logout action here
        } else if (error.response.status === 429) {
          // Rate limiting
          console.error('Too many requests. Please try again later.');
        }
      }
      return Promise.reject(error);
    }
  );
};

// Get all notifications for the current user
export const getNotifications = async () => {
  try {
    // Use the tracking helper to prevent duplicate calls
    const response = await trackApiCall('getNotifications', groceryAPI.get('/notifications'));
    
    // Optionally cache the response
    await AsyncStorage.setItem('cachedNotifications', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error.response?.data || error.message);
    
    // Try to return cached data if available
    try {
      const cachedData = await AsyncStorage.getItem('cachedNotifications');
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (cacheError) {
      console.error('Error retrieving cached notifications:', cacheError);
    }
    
    throw error;
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    // Add a small delay to make the UI feedback more visible
    return await trackApiCall(`markRead-${notificationId}`, 
      new Promise((resolve) => {
        setTimeout(async () => {
          const response = await groceryAPI.patch(`/notifications/${notificationId}/read`);
          resolve(response.data);
        }, 300);
      })
    );
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    // Add a small delay to make the UI feedback more visible
    return await trackApiCall(`delete-${notificationId}`, 
      new Promise((resolve) => {
        setTimeout(async () => {
          const response = await groceryAPI.delete(`/notifications/${notificationId}`);
          resolve(response.data);
        }, 300);
      })
    );
  } catch (error) {
    console.error('Error deleting notification:', error.response?.data || error.message);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    // Add a small delay to make the UI feedback more visible
    return await trackApiCall('markAllRead', 
      new Promise((resolve) => {
        setTimeout(async () => {
          const response = await groceryAPI.patch('/notifications/mark-all-read');
          resolve(response.data);
        }, 500);
      })
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error.response?.data || error.message);
    throw error;
  }
};

// Clear all notifications
export const clearAllNotifications = async () => {
  try {
    // Add a small delay to make the UI feedback more visible
    return await trackApiCall('clearAll', 
      new Promise((resolve) => {
        setTimeout(async () => {
          const response = await groceryAPI.delete('/notifications/clear-all');
          resolve(response.data);
        }, 500);
      })
    );
  } catch (error) {
    console.error('Error clearing all notifications:', error.response?.data || error.message);
    throw error;
  }
};

// Check for expiring items and create notifications if needed
export const checkExpiringItems = async () => {
  try {
    const response = await trackApiCall('checkExpiring', 
      groceryAPI.post('/notifications/check-expiring-items'));
    return response.data;
  } catch (error) {
    console.error('Error checking expiring items:', error.response?.data || error.message);
    throw error;
  }
};

// Check user shopping habits and create notifications if needed
export const checkShoppingReminders = async () => {
  try {
    const response = await trackApiCall('checkShopping', 
      groceryAPI.post('/notifications/check-shopping-reminders'));
    return response.data;
  } catch (error) {
    console.error('Error checking shopping reminders:', error.response?.data || error.message);
    throw error;
  }
};

// Register for push notifications (new function)
export const registerForPushNotifications = async (deviceToken) => {
  try {
    const response = await groceryAPI.post('/notifications/register-device', { deviceToken, platform: Platform.OS });
    return response.data;
  } catch (error) {
    console.error('Error registering for push notifications:', error.response?.data || error.message);
    throw error;
  }
};

// Set notification preferences (new function)
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await groceryAPI.post('/notifications/preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('Error updating notification preferences:', error.response?.data || error.message);
    throw error;
  }
};

// Get user's notification preferences (new function)
export const getNotificationPreferences = async () => {
  try {
    const response = await groceryAPI.get('/notifications/preferences');
    return response.data;
  } catch (error) {
    console.error('Error getting notification preferences:', error.response?.data || error.message);
    throw error;
  }
};