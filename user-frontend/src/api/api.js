// frontend/services/api.js

import axios from "axios";
//import { API_BASE_URL } from "@env";

// Create an Axios instance with a base URL and default headers
const api = axios.create({
  baseURL: "http://10.0.97.136:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API to register a new user
export const signUpUser = async (userData) => {
  try {
    const response = await api.post("/users/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// API to login a user
export const signInUser = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
// frontend/services/api.js
export const getUserProfile = async (token) => {
  try {
    const response = await api.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// API to update user details
export const updateUserDetails = async (token, updatedData) => {
  try {
    const response = await api.put("/users/edit", updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// API to delete a user
export const deleteUserAccount = async (token) => {
  try {
    const response = await api.delete("/users/delete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};