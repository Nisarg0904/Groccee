import { userAPI } from "./api";

// ✅ **Resend verification email**
export const resendVerificationEmail = async (data) => {
  try {
    const response = await userAPI.post("/email/send-verification-email", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Register a new user (Signup)**
export const signUpUser = async (userData) => {
  try {
    console.log("Sending request to: /auth/signup", "\nUser data:", userData);
    const response = await userAPI.post("/auth/signup", userData);
    console.log("Request sent");
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Login user**
export const signInUser = async (credentials) => {
  try {
    const response = await userAPI.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Get user profile**
export const getUserProfile = async (token) => {
  try {
    const response = await userAPI.get("/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Update user profile**
export const updateUserDetails = async (token, userData) => {
  try {
    const response = await userAPI.put("/users/profile", userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateUserDetails:", error.response || error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Delete user account**
export const deleteUserAccount = async (token) => {
  try {
    const response = await userAPI.delete("/users/delete", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Send password reset OTP**
export const sendPasswordResetEmail = async (data) => {
  try {
    const response = await userAPI.post("/password/send-password-reset", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Verify password reset OTP**
export const verifyPasswordResetOTP = async (data) => {
  try {
    const response = await userAPI.post("/password/verify-reset-otp", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Reset password**
export const resetPassword = async (data) => {
  try {
    const response = await userAPI.put("/password/reset-password", data);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

// ✅ **Verify email**
export const verifyEmail = async (userId, token) => {
  try {
    const response = await userAPI.get(
      `/email/verify-email?userId=${userId}&token=${token}`
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
