import React, { useContext, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from "react-native";
// For grocery analytics we are using a pie chart from react-native-chart-kit.
// Ensure you have installed both "react-native-chart-kit" and "react-native-svg".
import { PieChart } from "react-native-chart-kit";
// Import MaterialCommunityIcons from Expo vector icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
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
      <View style={styles.sectionHeaderOverlay} />
      <View style={styles.sectionHeaderContent}>
        <MaterialCommunityIcons
          name={iconName}
          size={28}
          color="#007BFF"
          style={styles.sectionHeaderIcon}
        />
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
      <View style={styles.sectionHeaderDivider} />
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

const MainMenuPage = ({ navigation, route }) => {
  const { setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    setCurrentUser(null);
    navigation.navigate("SignIn");
  };

  // Dummy data for Recent Last Meal Carousel using local assets
  const mealData = [
    {
      id: "1",
      imageUri: require("../../../assets/meal01.webp"),
    },
    {
      id: "2",
      imageUri: require("../../../assets/meal02.webp"),
    },
    {
      id: "3",
      imageUri: require("../../../assets/meal03.webp"),
    },
  ];

  // Dummy data for Latest Expiring Items
  const expiringItems = [
    { id: "1", item: "Milk", expiry: "2023-11-05", quantity: 2 },
    { id: "2", item: "Eggs", expiry: "2023-11-06", quantity: 12 },
    { id: "3", item: "Bread", expiry: "2023-11-04", quantity: 1 },
  ];

  // Expense Section State – controls whether the breakdown is shown
  const [isExpenseExpanded, setIsExpenseExpanded] = useState(false);
  const handleToggleExpense = () => {
    setIsExpenseExpanded(!isExpenseExpanded);
  };

  // Helper to calculate days remaining from the expiry date
  const calculateDaysRemaining = (expiryDateString) => {
    const expiryDate = new Date(expiryDateString);
    const currentDate = new Date();
    const diffTime = expiryDate - currentDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Render a single meal item for the carousel
  const renderMealItem = (meal) => (
    <View
      key={meal.id}
      style={[
        styles.carouselItem,
        { width: carouselItemWidth, marginHorizontal: carouselSpacing / 2 },
      ]}
    >
      <Image
        source={meal.imageUri}
        style={styles.carouselImage}
        resizeMode="cover" // Use cover so it fills the container
      />
      <TouchableOpacity
        style={styles.carouselButton}
        onPress={() => navigation.navigate("MealDetail", { meal })}
      >
        <Text style={styles.carouselButtonText}>Know More</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Home</Text>

      {/* Recent Last Meal Carousel */}
      <View style={styles.sectionContainer}>
        <SectionHeader
          iconName="silverware-fork-knife"
          title="Discover Featured Flavors"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={carouselItemWidth + carouselSpacing}
          contentContainerStyle={styles.carouselContainer}
        >
          {mealData.map((meal) => renderMealItem(meal))}
        </ScrollView>
      </View>

      {/* Latest Expiring Items Section (Card-based with icons) */}
      <View style={styles.sectionContainer}>
        <SectionHeader
          iconName="calendar-alert"
          title="Latest Expiring Items"
        />
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
            <View
              key={item.id}
              style={[
                styles.expiringItemCard,
                { borderLeftColor: urgencyColor },
              ]}
            >
              <View style={styles.expiringItemRow}>
                <MaterialCommunityIcons
                  name={iconName}
                  size={24}
                  color={urgencyColor}
                  style={styles.expiringItemIcon}
                />
                <View style={styles.expiringItemTextContainer}>
                  <Text style={styles.expiringItemName}>{item.item}</Text>
                  <Text style={styles.expiringItemExpiry}>
                    Expiry: {item.expiry}
                  </Text>
                  <Text style={styles.expiringItemDays}>
                    Days Remaining: {daysRemaining}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Expense Section */}
      <View style={styles.sectionContainer}>
        <SectionHeader iconName="cash-multiple" title="Latest Expenses" />
        <View style={styles.expenseCard}>
          <Text style={styles.expenseTotal}>
            Total: {expenseDataToday.total}
          </Text>
          {isExpenseExpanded &&
            expenseDataToday.details.map((detail) => {
              const detailValue = parseFloat(detail.amount.replace("$", ""));
              const totalValue = parseFloat(
                expenseDataToday.total.replace("$", "")
              );
              const progress = detailValue / totalValue;
              return (
                <View key={detail.id} style={styles.expenseDetailRow}>
                  <Text style={styles.expenseDetailText}>
                    {detail.category} ({detail.amount})
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          <TouchableOpacity onPress={handleToggleExpense}>
            <Text style={styles.expenseToggleText}>
              {isExpenseExpanded ? "Hide Details" : "Show Details"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grocery Expense Analytics with interactive ChartSwitcher */}
      <View style={[styles.sectionContainer, styles.chartContainer]}>
        <SectionHeader iconName="chart-pie" title="Grocery Expense Analytics" />
        <ChartSwitcher
          dataSets={dataSets}
          chartConfig={chartConfig}
          width={width}
        />
      </View>
    </ScrollView>
  );
};

export default MainMenuPage;
