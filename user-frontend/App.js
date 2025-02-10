import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import UserProvider, { UserContext } from "./src/contexts/UserContext";
import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const { token } = React.useContext(UserContext);
  return (
    <NavigationContainer>
      {token ? <AppNavigator /> : <AuthNavigator />}
      <Toast />
    </NavigationContainer>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load your custom fonts
        await Font.loadAsync({
          Crotah: require("./assets/fonts/Crotah.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}