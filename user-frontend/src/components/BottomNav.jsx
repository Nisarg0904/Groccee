// BottomNav.jsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/BottomNavStyles"; // Adjust path if needed

export function BottomNav({ navigation, route }) {
  const [activeTab, setActiveTab] = useState("MainMenu");

  useEffect(() => {
    const currentRoute = route?.name || "MainMenu";
    setActiveTab(currentRoute);
  }, [route]);

  const navigateTo = (tab, screen) => {
    setActiveTab(tab);
    navigation.navigate(screen);
  };

  return (
    // shapeWrapper holds both images (mirrored) and your nav items
    <View style={styles.shapeWrapper}>

      {/* BOTTOM (mirrored) IMAGE */}
      <Image
        source={{ uri: "https://via.placeholder.com/761x280" }}
        style={[styles.barImage, styles.barImageBottom]}
      />

      {/* ACTUAL NAVIGATION BAR */}
      <View style={styles.navContainer}>
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

        {/* Add Grocery (center button) */}
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
    </View>
  );
}
