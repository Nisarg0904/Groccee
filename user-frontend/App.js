import React, { useState } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import UserProvider from "./src/contexts/UserContext";
import Toast from "react-native-toast-message";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

// Function to load custom fonts
const fetchFonts = () => {
  return Font.loadAsync({
    // 'Crotah' key is used in your styles (e.g., fontFamily: 'Crotah')
    Crotah: require("./assets/fonts/Crotah.ttf"),
    // Add more fonts here if needed
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    // Display a loading screen until the fonts are loaded
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <UserProvider>
      <AppNavigator />
      <Toast />
    </UserProvider>
  );
}
