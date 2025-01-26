import React, { useState } from "react";
import AppNavigator from "./navigation/AppNavigator";
import UserProvider from "./contexts/UserContext";
import Toast from "react-native-toast-message";

export default function App() {
  // const [currentPage, setCurrentPage] = useState("");
  return (
      <UserProvider>
          <AppNavigator />
          <Toast />
      </UserProvider>
  );
}
