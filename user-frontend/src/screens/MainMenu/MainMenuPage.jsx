import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions
} from "react-native";
// For grocery analytics we are using a pie chart from react-native-chart-kit.
// Ensure you have installed both "react-native-chart-kit" and "react-native-svg".
import { PieChart } from "react-native-chart-kit";
import { UserContext } from "../../contexts/UserContext";
import styles from "../../styles/MainMenuPageStyles";

const { width } = Dimensions.get("window");
const carouselItemWidth = width * 0.8;
const carouselSpacing = width * 0.05;

const MainMenuPage = ({ navigation, route }) => {
  const { setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    setCurrentUser(null);
    navigation.navigate("SignIn");
  };

  // Dummy data for Recent Last Meal Carousel
  const mealData = [
    { id: "1", imageUri: "https://via.placeholder.com/300x200.png?text=Meal+1" },
    { id: "2", imageUri: "https://via.placeholder.com/300x200.png?text=Meal+2" },
    { id: "3", imageUri: "https://via.placeholder.com/300x200.png?text=Meal+3" }
  ];

  // Dummy data for Latest Expiring Items Table
  const expiringItems = [
    { id: "1", item: "Milk", expiry: "2023-11-05", quantity: 2 },
    { id: "2", item: "Eggs", expiry: "2023-11-06", quantity: 12 },
    { id: "3", item: "Bread", expiry: "2023-11-04", quantity: 1 }
  ];

  // Updated dummy data for Latest Expenses (focused on grocery subcategories)
  const expenseData = {
    total: "$120.50",
    details: [
      { id: "1", category: "Dairy", amount: "$30.00" },
      { id: "2", category: "Meat", amount: "$40.00" },
      { id: "3", category: "Produce", amount: "$25.00" },
      { id: "4", category: "Bakery", amount: "$25.50" }
    ]
  };

  // Dummy notifications data
  const notifications = [
    { id: "1", message: "Milk expires in 2 days." },
    { id: "2", message: "Eggs are nearing expiry." },
    { id: "3", message: "Bakery items have been restocked." }
  ];

  // Colors for the Pie Chart segments
  const chartColors = ["#F44336", "#2196F3", "#4CAF50", "#FFC107"];

  // Process expense details for PieChart
  const pieData = expenseData.details.map((detail, index) => ({
    name: detail.category,
    amount: parseFloat(detail.amount.replace("$", "")),
    color: chartColors[index % chartColors.length],
    legendFontColor: "#333",
    legendFontSize: 12
  }));

  // Chart configuration for the analytics
  const chartConfig = {
    backgroundColor: "#f8f9fa",
    backgroundGradientFrom: "#f8f9fa",
    backgroundGradientTo: "#f8f9fa",
    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  // Render a single meal item for the carousel
  const renderMealItem = (meal) => (
    <View
      key={meal.id}
      style={[
        styles.carouselItem,
        { width: carouselItemWidth, marginHorizontal: carouselSpacing / 2 }
      ]}
    >
      {/* For performance enhancements, consider using a lazy-loading image component */}
      <Image source={{ uri: meal.imageUri }} style={styles.carouselImage} resizeMode="cover" />
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
        <Text style={styles.sectionTitle}>Recent Last Meal</Text>
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

      {/* Latest Expiring Items Table */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Latest Expiring Items</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeaderText, styles.tableCell]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell]}>Expiry</Text>
            <Text style={[styles.tableHeaderText, styles.tableCell]}>Qty</Text>
          </View>
          {expiringItems.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.item}</Text>
              <Text style={styles.tableCell}>{item.expiry}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Latest Expenses Section (Grocery Subcategories) */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Latest Expenses</Text>
        <View style={styles.expenseCard}>
          <Text style={styles.expenseTotal}>Total: {expenseData.total}</Text>
          {expenseData.details.map((detail) => (
            <View key={detail.id} style={styles.expenseDetailRow}>
              <Text style={styles.expenseDetailText}>{detail.category}</Text>
              <Text style={styles.expenseDetailText}>{detail.amount}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Grocery Expense Analytics */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Grocery Expense Analytics</Text>
        <PieChart
          data={pieData}
          width={width * 0.9}
          height={220}
          chartConfig={chartConfig}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Notifications Section */}
      {/* <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationItem}>
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        ))}
      </View> */}

      {/* Optionally, a logout button can be placed elsewhere in the app
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
};

export default MainMenuPage;
