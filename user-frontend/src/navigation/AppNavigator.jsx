import React from "react";
import { View, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import MainMenuPage from "../screens/MainMenu/MainMenuPage";
import ViewGroceriesPage from "../screens/Grocery/ViewGroceriesPage";
import WastagePage from "../screens/Wastage/WastagePage";
import AddGroceryPage from "../screens/Grocery/AddGroceryPage";
import ProfilePage from "../screens/ProfilePage/ProfilePage";
import EditProfilePage from "../screens/ProfilePage/EditProfilePage";
import NotificationsPage from "../screens/Notifications/NotificationsPage";
import InventoryPage from "../screens/Inventory/InventoryPage";
import EditGroceryPage from "../screens/Grocery/EditGroceryPage";

// Shopping Screens
import ShoppingListsPage from "../screens/Shopping/ShoppingListsPage";
import CreateShoppingListPage from "../screens/Shopping/CreateShoppingListPage";
import AddShoppingListItemsPage from "../screens/Shopping/AddShoppingListItemPage";
import ShoppingListItemsPage from "../screens/Shopping/ViewShoppingListItems";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ✅ Fix: Renamed "Grocce" to "MainMenu"
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={MainMenuPage}
      options={({ navigation }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "#fff",
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notifications")}
              style={{ marginHorizontal: 10 }}
            >
              <Ionicons
                name="notifications-outline"
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <View style={{ width: 15 }} />
            <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              style={{ marginRight: 15 }}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        ),
      })}
    />
    <Stack.Screen name="Profile" component={ProfilePage} />
    <Stack.Screen name="EditProfilePage" component={EditProfilePage} />
    <Stack.Screen name="Notifications" component={NotificationsPage} />
  </Stack.Navigator>
);
const InventoryStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="InventoryScreen" component={InventoryPage} />
    <Stack.Screen
      name="EditGroceryPage"
      component={EditGroceryPage}
      options={{
        headerShown: true,
        title: "Edit Grocery",
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "#fff",
      }}
    />
  </Stack.Navigator>
);


const ShoppingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'black',
      },
      headerTintColor: '#fff',
    }}
  >
    <Stack.Screen 
      name="ShoppingLists" 
      component={ShoppingListsPage}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen 
      name="CreateShoppingList" 
      component={CreateShoppingListPage}
      options={{
        title: 'Create New List',
        presentation: 'modal',
      }}
    />
      <Stack.Screen 
      name="ShoppingListItems" 
      component={ShoppingListItemsPage}
      options={({ route }) => ({
        title: route.params?.listName || 'Shopping List Items',
      })}
    />
    {/* <Stack.Screen 
      name="AddShoppingListItems" 
      component={AddShoppingListItemsPage}
      options={({ route }) => ({
        title: route.params?.listName || 'Add Items',
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('ShoppingLists')}
            style={{ marginLeft: 16 }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        ),
      })}
    /> */}
    <Stack.Screen 
      name="AddShoppingListItems" 
      component={AddShoppingListItemsPage}  // Previous modal page
      options={{
        title: 'Add Items',
        presentation: 'modal',
      }}
    />
  </Stack.Navigator>
);

const ReportsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WastageScreen" component={WastagePage} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "black" },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "black",
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarActiveTintColor: "#FF4141",
        tabBarInactiveTintColor: "gray",
        tabBarLabelStyle: { fontSize: 10, marginBottom: 5 },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Shopping":
              iconName = focused ? "cart" : "cart-outline";
              break;
            case "Inventory":
              iconName = focused ? "cube" : "cube-outline";
              break;
            case "Reports":
              iconName = focused ? "bar-chart" : "bar-chart-outline";
              break;
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Shopping" component={ShoppingStack} />
      <Tab.Screen
        name="AddGrocery"
        component={AddGroceryPage}
        options={{
          tabBarIcon: () => (
            <View
              style={{
                top: -15,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#FF4141",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="add" size={28} color="#FFFFFF" />
            </View>
          ),
          tabBarLabel: () => null,
          headerShown: false,
        }}
      />
      <Tab.Screen name="Inventory" component={InventoryStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator;