import React, { useContext, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
// For grocery analytics we are using a pie chart from react-native-chart-kit.
// Ensure you have installed both "react-native-chart-kit" and "react-native-svg".
import { PieChart } from "react-native-chart-kit";
// Import MaterialCommunityIcons from Expo vector icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import { getUserProfile } from "../../services/userApi";
import styles from "../../styles/MainMenuPageStyles";

const { width } = Dimensions.get("window");
const carouselItemWidth = width * 0.8;
const carouselSpacing = width * 0.05;

// -----------------
// SectionHeader Component
// -----------------
const SectionHeader = ({ iconName, title }) => {
  return (
    <View style={styles.sectionHeaderContainer}>
      <View style={styles.sectionHeaderContent}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color="#FF4141"
          style={styles.sectionHeaderIcon}
        />
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
    </View>
  );
};

// -----------------
// Chart and Expense Helpers & Data
// -----------------

// Define chart colors (used across datasets)
const chartColors = ["#F44336", "#2196F3", "#4CAF50", "#FFC107"];

// Helper function to compute pie chart data based on expense data
const computePieData = (data) => {
  const total = data.details.reduce(
    (sum, detail) => sum + parseFloat(detail.amount.replace("$", "")),
    0
  );
  return data.details.map((detail, index) => ({
    name: detail.category,
    amount:
      (parseFloat(detail.amount.replace("$", "")) / total) * 100, // percentage value
    color: chartColors[index % chartColors.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));
};

// Dummy expense data for different timeframes
const expenseDataToday = {
  total: "$120.50",
  details: [
    { id: "1", category: "Dairy", amount: "$30.00" },
    { id: "2", category: "Meat", amount: "$40.00" },
    { id: "3", category: "Produce", amount: "$25.00" },
    { id: "4", category: "Bakery", amount: "$25.50" },
  ],
};

const expenseDataWeek = {
  total: "$200.00",
  details: [
    { id: "1", category: "Dairy", amount: "$50.00" },
    { id: "2", category: "Meat", amount: "$80.00" },
    { id: "3", category: "Produce", amount: "$40.00" },
    { id: "4", category: "Bakery", amount: "$30.00" },
  ],
};

const expenseDataMonth = {
  total: "$500.00",
  details: [
    { id: "1", category: "Dairy", amount: "$120.00" },
    { id: "2", category: "Meat", amount: "$200.00" },
    { id: "3", category: "Produce", amount: "$100.00" },
    { id: "4", category: "Bakery", amount: "$80.00" },
  ],
};

// Compute pie data for each timeframe
const pieDataToday = computePieData(expenseDataToday);
const pieDataWeek = computePieData(expenseDataWeek);
const pieDataMonth = computePieData(expenseDataMonth);

// Data sets array to be used by the ChartSwitcher component
const dataSets = [pieDataToday, pieDataWeek, pieDataMonth];

// Chart configuration for the analytics
const chartConfig = {
  backgroundColor: "#f8f9fa",
  backgroundGradientFrom: "#f8f9fa",
  backgroundGradientTo: "#f8f9fa",
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

// ChartSwitcher component for interactive chart switching
const ChartSwitcher = ({ dataSets, chartConfig, width }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handleSwitch = (index) => {
    // Fade out the current chart
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setActiveIndex(index);
      // Fade in the new chart
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View>
      <View style={styles.chartSwitcherContainer}>
        {dataSets.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleSwitch(index)}
            style={[
              styles.chartSwitcherButton,
              activeIndex === index && styles.chartSwitcherButtonActive,
            ]}
          >
            <Text
              style={[
                styles.chartSwitcherButtonText,
                activeIndex === index && styles.chartSwitcherButtonTextActive,
              ]}
            >
              {index === 0 ? "Today" : index === 1 ? "Week" : "Month"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Animated.View style={{ opacity: animatedValue }}>
        <PieChart
          data={dataSets[activeIndex]}
          width={width * 0.9}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </Animated.View>
    </View>
  );
};

// Helper: Return an icon name based on the item name
const getItemIconName = (itemName) => {
  const name = itemName.toLowerCase();
  if (name.includes("milk")) return "cup-water";
  if (name.includes("egg")) return "egg";
  if (name.includes("bread")) return "bread-slice";
  // Default icon for other food items
  return "food";
};

// Sample data for categories
const categories = [
  {
    id: '1',
    name: 'Fruits',
    count: 12,
    icon: 'fruit-watermelon',
    color: '#FF8A65'
  },
  {
    id: '2',
    name: 'Vegetables',
    count: 8,
    icon: 'carrot',
    color: '#66BB6A'
  },
  {
    id: '3',
    name: 'Dairy',
    count: 6,
    icon: 'cheese',
    color: '#42A5F5'
  },
  {
    id: '4',
    name: 'Meat',
    count: 4,
    icon: 'food-steak',
    color: '#EF5350'
  },
  {
    id: '5',
    name: 'Bakery',
    count: 5,
    icon: 'bread-slice',
    color: '#FFA726'
  }
];

// Sample data for recent items
const recentItems = [
  {
    id: '1',
    name: 'Organic Milk',
    quantity: 1,
    unit: 'gallon',
    imageUrl: 'https://example.com/milk.jpg',
    category: 'Dairy'
  },
  {
    id: '2',
    name: 'Bananas',
    quantity: 6,
    unit: 'pcs',
    imageUrl: 'https://example.com/bananas.jpg',
    category: 'Fruits'
  },
  {
    id: '3',
    name: 'Ground Beef',
    quantity: 1,
    unit: 'lb',
    imageUrl: 'https://example.com/beef.jpg',
    category: 'Meat'
  }
];

// Sample data for shopping list items
const shoppingItems = [
  { id: '1', name: 'Milk', quantity: 1, category: 'Dairy', isChecked: false },
  { id: '2', name: 'Eggs', quantity: 12, category: 'Dairy', isChecked: true },
  { id: '3', name: 'Bread', quantity: 2, category: 'Bakery', isChecked: false },
  { id: '4', name: 'Apples', quantity: 6, category: 'Fruits', isChecked: false },
];

// Sample data for insights
const insights = [
  {
    id: '1',
    title: 'Usage Trend',
    text: 'You\'re using more milk than usual this week.',
    icon: 'chart-line',
    color: '#FF4141'
  },
  {
    id: '2',
    title: 'Suggested Purchase',
    text: 'You might run out of eggs soon based on your usage pattern.',
    icon: 'alert-circle-outline',
    color: '#FF4141'
  }
];

// Sample data for expiring items
const expiringItems = [
  { id: "1", item: "Milk", expiry: "2023-11-05", quantity: 2 },
  { id: "2", item: "Eggs", expiry: "2023-11-06", quantity: 12 },
  { id: "3", item: "Bread", expiry: "2023-11-04", quantity: 1 },
];

const MainMenuPage = ({ navigation, route }) => {
  const { currentUser, token, setCurrentUser } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    totalItems: 36,
    expiringItems: 3,
    shoppingItems: 8
  });

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          setLoading(true);
          const profileData = await getUserProfile(token);
          setUserDetails(profileData);
          
          // In a real app, you would fetch these stats from your API
          // This is a placeholder for demonstration
          setUserStats({
            totalItems: 36,
            expiringItems: expiringItems.length,
            shoppingItems: 8
          });
          
          setError(null);
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [token]);

  const [scaleAnim] = useState(new Animated.Value(1));

  const handleItemPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  // Helper to calculate days remaining from the expiry date
  const calculateDaysRemaining = (expiryDateString) => {
    const expiryDate = new Date(expiryDateString);
    const currentDate = new Date();
    const diffTime = expiryDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

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
      {/* Header Section */}
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
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={require('../../../assets/profile.png')} 
            style={styles.avatarImage} 
          />
        </TouchableOpacity>
      </View>

      {/* Error message if any */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Quick Info Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>My Pantry</Text>
          <Text style={styles.summaryCount}>You have {userStats.totalItems} items in stock</Text>
          <TouchableOpacity 
            style={styles.viewAllButton} 
            onPress={() => navigation.navigate('Inventory')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader iconName="shape" title="Categories" />
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: category.color }]}
                onPress={() => navigation.navigate('InventoryScreen', { category: category.name })}
                activeOpacity={0.9}
              >
                <MaterialCommunityIcons 
                  name={category.icon} 
                  size={28} 
                  color="#FFFFFF" 
                  style={styles.categoryIcon} 
                />
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} items</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Latest Expiring Items Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader iconName="calendar-alert" title="Expiring Soon" />
          {expiringItems.map((item) => {
            const daysRemaining = calculateDaysRemaining(item.expiry);
            const urgencyColor =
              daysRemaining <= 1
                ? "#F44336" // red
                : daysRemaining <= 3
                ? "#FFC107" // amber
                : "#4CAF50"; // green
            const iconName = getItemIconName(item.item);
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.expiringItemCard}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('InventoryScreen')}
              >
                <View style={styles.expiringItemIcon}>
                  <MaterialCommunityIcons
                    name={iconName}
                    size={24}
                    color={urgencyColor}
                  />
                </View>
                <View style={styles.expiringItemTextContainer}>
                  <Text style={styles.expiringItemName}>{item.item}</Text>
                  <Text style={styles.expiringItemExpiry}>
                    Expires in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recipe Generator Section */}
<View style={styles.sectionContainer}>
  <SectionHeader iconName="chef-hat" title="Recipe Recommendations" />
  
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

        {/* Shopping List Preview */}
        <TouchableOpacity 
          style={styles.shoppingListPreview}
          onPress={() => navigation.navigate('Shopping')}
          activeOpacity={0.9}
        >
          <View style={styles.shoppingListIcon}>
            <MaterialCommunityIcons name="cart" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.shoppingListInfo}>
            <Text style={styles.shoppingListTitle}>Weekly Shopping</Text>
            <Text style={styles.shoppingListCount}>{userStats.shoppingItems} items remaining</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* User Activity Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader iconName="account-details" title="Your Account" />
          <TouchableOpacity 
            style={styles.userActionCard}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="account-edit" size={24} color="#FF4141" />
            <Text style={styles.userActionText}>Edit Profile</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.userActionCard}
            onPress={() => navigation.navigate('Notifications')}
            activeOpacity={0.9}
          >
            <MaterialCommunityIcons name="bell" size={24} color="#FF4141" />
            <Text style={styles.userActionText}>Notifications</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default MainMenuPage;