import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import pages from the pages folder
import WelcomePage from "../screens/WelcomePage";
import SignInPage from "../screens/SignInPage";
import SignUpPage from "../screens/SignUpPage";
import ProfileSetupPage from "../screens/ProfileSetupPage";
import MainMenuPage from "../screens/MainMenuPage";
import AddGroceryPage from "../screens/AddGroceryPage"; // Import new screen
import ViewGroceriesPage from "../screens/ViewGroceriesPage"; // Import new screen
import EditGroceryPage from "../screens/EditGroceryPage"; // Import new screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Welcome Screen */}
        <Stack.Screen name="Welcome" component={WelcomePage} />

        {/* Sign-In Screen */}
        <Stack.Screen name="SignIn" component={SignInPage} />

        {/* Sign-Up Screen */}
        <Stack.Screen name="SignUp" component={SignUpPage} />

        {/* Profile Setup Screen */}
        <Stack.Screen name="ProfileSetup" component={ProfileSetupPage} />

        {/* Main Menu Screen */}
        <Stack.Screen name="MainMenu" component={MainMenuPage} />

        {/* Grocery Management Screens */}
        <Stack.Screen name="AddGrocery" component={AddGroceryPage} />
        <Stack.Screen name="ViewGroceries" component={ViewGroceriesPage} />
        <Stack.Screen name="EditGrocery" component={EditGroceryPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
