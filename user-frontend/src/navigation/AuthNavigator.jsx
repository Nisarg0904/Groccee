import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomePage from "../screens/Welcome/WelcomePage";
import SignInPage from "../screens/SignIn/SignInPage";
import SignUpPage from "../screens/SignUp/SignUpPage";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
    <Stack.Screen name="Welcome" component={WelcomePage} />
    <Stack.Screen name="SignIn" component={SignInPage} />
    <Stack.Screen name="SignUp" component={SignUpPage} />
  </Stack.Navigator>
);

export default AuthNavigator;