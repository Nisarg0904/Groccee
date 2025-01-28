import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { CardStyleInterpolators } from "@react-navigation/stack";

// Import pages from the pages folder
import WelcomePage from "../screens/Welcome/WelcomePage";
import SignInPage from "../screens/SignIn/SignInPage";
import SignUpPage from "../screens/SignUp/SignUpPage";
import ProfileSetupPage from "../screens/ProfileSetup/ProfileSetupPage";
import MainMenuPage from "../screens/MainMenu/MainMenuPage";
import AddGroceryPage from "../screens/Grocery/AddGroceryPage";
import ViewGroceriesPage from "../screens/Grocery/ViewGroceriesPage";
import EditGroceryPage from "../screens/Grocery/EditGroceryPage";
import ShoppingListPage from "../screens/Shopping/ShoppingListPage";
import ShoppingListsPage from "../screens/Shopping/ShoppingListsPage";
import ShoppingListItemsPage from "../screens/Shopping/ShoppingListItemsPage";


const Stack = createStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: "black",
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
  },
  headerTintColor: "#F8F8FF", // Ghost white
  headerTitleStyle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  cardStyle: { backgroundColor: "black" },
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: { animation: "timing", config: { duration: 300 } },
    close: { animation: "timing", config: { duration: 300 } },
  },
  gestureEnabled: true,
  gestureDirection: "horizontal",
};

const authScreenOptions = {
  ...screenOptions,
  headerShown: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={screenOptions}>
        {/* Authentication Screens */}
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={authScreenOptions}
        />
        <Stack.Screen
          name="SignIn"
          component={SignInPage}
          options={authScreenOptions}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpPage}
          options={authScreenOptions}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupPage}
          options={{ title: "Profile Setup" }}
        />
        <Stack.Screen
          name="MainMenu"
          component={MainMenuPage}
          options={{ title: "Main Menu" }}
        />
        <Stack.Screen
          name="AddGrocery"
          component={AddGroceryPage}
          options={{ title: "Add Grocery" }}
        />
        <Stack.Screen
          name="ViewGroceries"
          component={ViewGroceriesPage}
          options={{ title: "My Groceries" }}
        />
        <Stack.Screen
          name="EditGrocery"
          component={EditGroceryPage}
          options={{ title: "Edit Grocery" }}
        />
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingListPage}
          options={{ title: "Shopping List" }}
        />

        <Stack.Screen
          name="ShoppingLists"
          component={ShoppingListsPage}
          options={({ route }) => ({
            title:
              route.params.status === "bought"
                ? "Bought Items"
                : "Unbought Items",
          })}
        />

        <Stack.Screen
          name="ShoppingListItems"
          component={ShoppingListItemsPage}
          options={{ title: "Shopping List Items" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
