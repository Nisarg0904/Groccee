import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null); // Track JWT token for the session
  const [currentUser, setCurrentUser] = useState(null); // Track signed-in user details

  // Save token and user details to AsyncStorage
  const saveToStorage = async (key, value) => {
    try {
      if (value !== null && value !== undefined) {
        await AsyncStorage.setItem(key, JSON.stringify(value));
      } else {
        // Remove key if the value is null or undefined
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error saving ${key} to AsyncStorage:`, error);
    }
  };

  // Load token and user details from AsyncStorage
  const loadFromStorage = async (key) => {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : null;
    } catch (error) {
      console.error(`Error loading ${key} from AsyncStorage:`, error);
      return null;
    }
  };

  useEffect(() => {
    // Load token and current user from storage when app starts
    const loadUserData = async () => {
      const savedToken = await loadFromStorage("token");
      const savedUser = await loadFromStorage("currentUser");

      if (savedToken) setToken(savedToken);
      if (savedUser) setCurrentUser(savedUser);
    };

    loadUserData();
  }, []);

  useEffect(() => {
    // Save token and user details whenever they change
    if (token) {
      saveToStorage("token", token);
    } else {
      saveToStorage("token", null);
    }

    if (currentUser) {
      saveToStorage("currentUser", currentUser);
    } else {
      saveToStorage("currentUser", null);
    }
  }, [token, currentUser]);

  return (
    <UserContext.Provider
      value={{ token, setToken, currentUser, setCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
