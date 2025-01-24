import React, { useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import UserProvider from "./src/contexts/UserContext";
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
