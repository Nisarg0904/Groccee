// contexts/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSetToken = async (newToken) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem("token", JSON.stringify(newToken));
        setToken(newToken);
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("currentUser");
        setToken(null);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error setting token:", error);
    }
  };

  const handleSetUser = async (user) => {
    try {
      if (user) {
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
      } else {
        await AsyncStorage.removeItem("currentUser");
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error setting user:", error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("currentUser");
      setToken(null);
      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("currentUser");

        if (storedToken) setToken(JSON.parse(storedToken));
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error loading stored data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  return (
    <UserContext.Provider
      value={{
        token,
        setToken: handleSetToken,
        currentUser,
        setCurrentUser: handleSetUser,
        logout,
        isLoading,
      }}
    >
      {!isLoading && children}
    </UserContext.Provider>
  );
};

export default UserProvider;