import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../../contexts/UserContext";
import { getUserProfile } from "../../services/userApi";
import { fetchGroceries, getGroceriesByStatus } from "../../services/groceryApi";
import { getAllShoppingLists } from "../../services/shoppingApi";
import styles from "../../styles/MainMenuPageStyles";

const MainMenuPage = ({ navigation }) => {
  const { currentUser, token } = useContext(UserContext);

  // Basic loading/error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile
  const [userDetails, setUserDetails] = useState(null);

  // Pantry + Shopping Data
  const [groceries, setGroceries] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [shoppingLists, setShoppingLists] = useState([]);

  // Summary stats
  const [userStats, setUserStats] = useState({
    totalItems: 0,
    expiringItems: 0,
    shoppingItems: 0,
  });

  // Animation for recipe generator
  const [scaleAnim] = useState(new Animated.Value(1));

  // -----------------------------------------
  // Fetch all the data we need for the screen
  // -----------------------------------------
  const fetchData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);

      // 1) Fetch user profile
      const profileData = await getUserProfile(token);
      setUserDetails(profileData);

      // 2) Fetch all groceries (for total count)
      const allGroceries = await fetchGroceries(token);
      setGroceries(allGroceries);

      // 3) Fetch expiring items from your /status endpoint
      const soonExpiring = await getGroceriesByStatus(token, "expiring");

      // 4) Fetch the user's weekly shopping lists
      const allLists = await getAllShoppingLists(token);
      const totalShopping = allLists.reduce(
        (sum, list) => sum + (list.items?.length || 0),
        0
      );

      // 5) Update state
      setExpiringItems(soonExpiring);
      setShoppingLists(allLists);
      setUserStats({
        totalItems: allGroceries.length,
        expiringItems: soonExpiring.length,
        shoppingItems: totalShopping,
      });
    } catch (err) {
      console.error("Error in MainMenu fetch:", err);
      setError("Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // Re-fetch data whenever screen is focused
  // -----------------------------------------
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token])
  );

  // Simple greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  // Loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4141" />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            {getGreeting()}, {currentUser?.firstName || "User"}
          </Text>
          {userDetails?.email && (
            <Text style={styles.emailText}>{userDetails.email}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.profileAvatar}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={require("../../../assets/profile.png")}
            style={styles.avatarImage}
          />
        </TouchableOpacity>
      </View>

      {/* Error Message (if any) */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pantry Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>My Pantry</Text>
          <Text style={styles.summaryCount}>
            You have {userStats.totalItems} items in stock
          </Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate("Inventory")}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Expiring Soon (first 3 items) */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionHeaderContent}>
              <MaterialCommunityIcons
                name="calendar-alert"
                size={24}
                color="#FF4141"
                style={styles.sectionHeaderIcon}
              />
              <Text style={styles.sectionHeaderText}>Expiring Soon</Text>
            </View>
          </View>

          {/* Display only the first 3 expiring items */}
          {expiringItems.slice(0, 3).map((item) => (
            <TouchableOpacity
              key={item._id} // or item.id
              style={styles.expiringItemCard}
              activeOpacity={0.9}
              onPress={() => navigation.navigate("Inventory")}
            >
              <View style={styles.expiringItemIcon}>
                {/* Pick icons based on your logic */}
                <MaterialCommunityIcons name="food" size={24} color="#FFC107" />
              </View>
              <View style={styles.expiringItemTextContainer}>
                <Text style={styles.expiringItemName}>{item.name}</Text>
                <Text style={styles.expiringItemExpiry}>Expires soon</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* If more than 3 expiring items, show "View More" */}
          {expiringItems.length > 3 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => navigation.navigate("Inventory")}
            >
              <Text style={styles.viewAllButtonText}>View More</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recipe Generator Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderContainer}>
            <View style={styles.sectionHeaderContent}>
              <MaterialCommunityIcons
                name="chef-hat"
                size={24}
                color="#FF4141"
                style={styles.sectionHeaderIcon}
              />
              <Text style={styles.sectionHeaderText}>Recipe Recommendations</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.recipeGeneratorCard}
            onPress={() => {
              // Animation effect
              Animated.sequence([
                Animated.timing(scaleAnim, {
                  toValue: 0.97,
                  duration: 100,
                  useNativeDriver: true
                }),
                Animated.timing(scaleAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true
                })
              ]).start(() => {
                // Navigate to recipe listing screen
                navigation.navigate('RecipeList');
              });
            }}
          >
            <Animated.View 
              style={[
                styles.recipeGeneratorCardContent,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <View style={styles.recipeGeneratorIconContainer}>
                <MaterialCommunityIcons name="silverware-fork-knife" size={38} color="#FFFFFF" />
              </View>
              <View style={styles.recipeGeneratorTextContainer}>
                <Text style={styles.recipeGeneratorTitle}>Generate Recipes</Text>
                <Text style={styles.recipeGeneratorDescription}>
                  Get personalized recipes based on your expiring ingredients
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={28} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Weekly Shopping */}
        <TouchableOpacity
          style={styles.shoppingListPreview}
          onPress={() => navigation.navigate("Shopping")}
          activeOpacity={0.9}
        >
          <View style={styles.shoppingListIcon}>
            <MaterialCommunityIcons name="cart" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.shoppingListInfo}>
            <Text style={styles.shoppingListTitle}>Weekly Shopping</Text>
            <Text style={styles.shoppingListCount}>
              {userStats.shoppingItems} items remaining
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MainMenuPage;