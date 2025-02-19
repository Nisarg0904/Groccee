import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../../contexts/UserContext";
import {
  fetchAllWastage,
  fetchWastageByCategory,
  fetchWastageByItemId,
  fetchWastageByDate,
  fetchTotalWastedAmountForCategory,
  fetchTotalWastedAmountForItem,
} from "../../services/wastageApi";
import { getAllCategories } from "../../services/globalItemApi";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/WastagePageStyles";

const WastagePage = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [wastageRecords, setWastageRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, category, item, date, period
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [totalWastedAmount, setTotalWastedAmount] = useState(0);

  // Load all wastage records
  const loadWastageRecords = async () => {
    try {
      const data = await fetchAllWastage(token);
      setWastageRecords(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load wastage records. Please try again.");
    }
  };

  // Load all categories
  const loadCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load categories. Please try again.");
    }
  };

  // Fetch wastage by category
  const handleCategoryFilter = async (category) => {
    try {
      const data = await fetchWastageByCategory(category, token);
      setWastageRecords(data);
      const totalAmount = await fetchTotalWastedAmountForCategory(
        category,
        token
      );
      setTotalWastedAmount(totalAmount.total_wasted_amount || 0);
      setSelectedCategory(category);
      setFilterType("category");
    } catch (error) {
      Alert.alert("Error", "Failed to filter by category. Please try again.");
    }
  };

  // Fetch wastage by item
  const handleItemFilter = async (itemId) => {
    try {
      const data = await fetchWastageByItemId(itemId, token);
      setWastageRecords(data);
      const totalAmount = await fetchTotalWastedAmountForItem(itemId, token);
      setTotalWastedAmount(totalAmount.total_wasted_amount || 0);
      setSelectedItem(itemId);
      setFilterType("item");
    } catch (error) {
      Alert.alert("Error", "Failed to filter by item. Please try again.");
    }
  };

  // Fetch wastage by date
  const handleDateFilter = async (date) => {
    try {
      const formattedDate = date.toISOString().split("T")[0];
      const data = await fetchWastageByDate(formattedDate, token);
      setWastageRecords(data);
      setFilterType("date");
    } catch (error) {
      Alert.alert("Error", "Failed to filter by date. Please try again.");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType("all");
    setSelectedCategory(null);
    setSelectedItem(null);
    setTotalWastedAmount(0);
    loadWastageRecords();
  };

  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      loadWastageRecords();
      loadCategories();
    }, [token])
  );

  // Render each wastage record
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.itemDetail}>
        {item.wasted_quantity} {item.item_unit}
      </Text>
      <Text style={styles.itemDetail}>Reason: {item.reason_for_waste}</Text>
      <Text style={styles.itemDetail}>
        Date: {new Date(item.wastage_date).toLocaleDateString()}
      </Text>
      <Text style={styles.itemDetail}>Category: {item.category}</Text>
      <Text style={styles.itemDetail}>Wasted Money: ${item.wasted_money}</Text>
    </View>
  );

  // Filter bar component
  const FilterBar = () => (
    <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === "all" && styles.filterButtonActive,
          ]}
          onPress={resetFilters}
        >
          <Text
            style={[
              styles.filterText,
              filterType === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterButton,
              selectedCategory === category && styles.filterButtonActive,
            ]}
            onPress={() => handleCategoryFilter(category)}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === category && styles.filterTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search wastage..."
            value={filterQuery}
            onChangeText={setFilterQuery}
            placeholderTextColor="#666666"
          />
        </View>
        <FilterBar />
      </View>

      {filterType !== "all" && (
        <View style={styles.totalWastedContainer}>
          <Text style={styles.totalWastedText}>
            Total Wasted: ${totalWastedAmount.toFixed(2)}
          </Text>
        </View>
      )}

      <FlatList
        data={wastageRecords.filter((item) =>
          item.item_name.toLowerCase().includes(filterQuery.toLowerCase())
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.wastage_id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No wastage records found</Text>
        }
      />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              setSelectedDate(date);
              handleDateFilter(date);
            }
          }}
        />
      )}
    </View>
  );
};

export default WastagePage;
