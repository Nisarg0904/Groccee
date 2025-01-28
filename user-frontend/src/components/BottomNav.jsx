import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/BottomNavStyles";

export function BottomNav({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("MainMenu");

  useEffect(() => {
    const currentRoute = route?.name || "MainMenu"; // Default to MainMenu if route is undefined
    setActiveTab(currentRoute);
  }, [route]);

  const navigateTo = (tab, screen) => {
    setActiveTab(tab);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo("MainMenu", "MainMenu")}
      >
        <Ionicons
          name="home-outline"
          size={24}
          color={activeTab === "MainMenu" ? "#E52B50" : "#F8F8FF"}
        />
        <Text
          style={[
            styles.label,
            activeTab === "MainMenu" ? styles.activeLabel : null,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      {/* Shopping List */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo("ShoppingList", "ShoppingList")}
      >
        <Ionicons
          name="cart-outline"
          size={24}
          color={activeTab === "ShoppingList" ? "#E52B50" : "#F8F8FF"}
        />
        <Text
          style={[
            styles.label,
            activeTab === "ShoppingList" ? styles.activeLabel : null,
          ]}
        >
          Shopping
        </Text>
      </TouchableOpacity>

      {/* Add Grocery */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() => navigation.navigate("AddGrocery")}
      >
        <Ionicons name="add-circle-outline" size={30} color="#F8F8FF" />
      </TouchableOpacity>

      {/* Inventory */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo("ViewGroceries", "ViewGroceries")}
      >
        <Ionicons
          name="cube-outline"
          size={24}
          color={activeTab === "ViewGroceries" ? "#E52B50" : "#F8F8FF"}
        />
        <Text
          style={[
            styles.label,
            activeTab === "ViewGroceries" ? styles.activeLabel : null,
          ]}
        >
          Inventory
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigateTo("ProfileSetup", "ProfileSetup")}
      >
        <Ionicons
          name="person-outline"
          size={24}
          color={activeTab === "ProfileSetup" ? "#E52B50" : "#F8F8FF"}
        />
        <Text
          style={[
            styles.label,
            activeTab === "ProfileSetup" ? styles.activeLabel : null,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
