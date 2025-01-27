import { userAPI } from "./api";
import axios from "axios";

// Resend verification email
export const resendVerificationEmail = async (data) => {
  try {
    const response = await userAPI.post(
      "/users/resend-verification-email",
      data
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Register a new user
export const signUpUser = async (userData) => {
  try {
    const response = await userAPI.post("/users/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (data) => {
  try {
    const response = await userAPI.post("/users/send-password-reset", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Login a user
export const signInUser = async (credentials) => {
  try {
    const response = await userAPI.post("/users/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Get user profile
export const getUserProfile = async (token) => {
  try {
    const response = await userAPI.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// Update user details
// Update user details
export const updateUserDetails = async (token, userData) => {
  try {
    const response = await userAPI.put("/users/edit", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateUserDetails:", error.response || error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};


// Delete user account
export const deleteUserAccount = async (token) => {
  try {
    const response = await userAPI.delete("/users/delete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
