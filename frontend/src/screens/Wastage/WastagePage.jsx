
import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { UserContext } from "../../contexts/UserContext";
import {
  fetchAllWastage,
  fetchWastageByCategory,
  fetchWastageByDate,
  fetchWastageByDateRange,
  fetchTotalWastedAmountForCategory,
} from "../../services/wastageApi";
import { getAllCategories } from "../../services/globalItemApi";
import Icon from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";

const WastagePage = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [wastageRecords, setWastageRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryWastage, setCategoryWastage] = useState({});
  
  // Filter state
  const [filterType, setFilterType] = useState("all"); // 'all', 'date', 'week', 'month', 'category'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  
  // Date handling
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalItems: 0,
    thisMonth: 0,
    totalAmount: 0
  });
  
  // Format date to YYYY-MM-DD
  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  // Helper functions for date handling
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  // Load all wastage records
  const loadWastageRecords = async () => {
    try {
      const data = await fetchAllWastage(token);
      setWastageRecords(data);
      updateSummaryStats(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load wastage records. Please try again.");
    }
  };
  
  // Update summary statistics
  const updateSummaryStats = (data) => {
    const totalItems = data.length;
    
    // Calculate this month's items
    const today = new Date();
    const thisMonthItems = data.filter(item => {
      const itemDate = new Date(item.wastage_date);
      return itemDate.getMonth() === today.getMonth() && 
             itemDate.getFullYear() === today.getFullYear();
    }).length;
    
    // Calculate total wasted amount
    const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.wasted_money), 0);
    
    // Calculate wastage by category
    const categoryTotals = {};
    data.forEach(item => {
      if (!categoryTotals[item.category]) {
        categoryTotals[item.category] = {
          amount: 0,
          count: 0
        };
      }
      categoryTotals[item.category].amount += parseFloat(item.wasted_money);
      categoryTotals[item.category].count += 1;
    });
    
    setCategoryWastage(categoryTotals);
    
    setSummaryStats({
      totalItems,
      thisMonth: thisMonthItems,
      totalAmount
    });
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

  // Handle category filter
  const handleCategoryFilter = async (category) => {
    try {
      setSelectedCategory(category);
      
      const data = await fetchWastageByCategory(category, token);
      setWastageRecords(data);
      updateSummaryStats(data);
      setFilterType("category");
      setShowCategoryModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to filter by category. Please try again.");
    }
  };

  // Handle date filter
  const handleDateFilter = async (date) => {
    try {
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        throw new Error("Invalid date object");
      }
      
      const formattedDate = formatDate(date);
      
      const data = await fetchWastageByDate(formattedDate, token);
      setWastageRecords(data);
      updateSummaryStats(data);
      setFilterType("date");
      setSelectedDate(date);
      setShowFilterModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to filter by date. Please try again.");
    }
  };

  // Handle week filter (current week)
  const handleWeekFilter = async () => {
    try {
      const today = new Date();
      const startDate = getStartOfWeek(today);
      const endDate = getEndOfWeek(today);
      
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      const data = await fetchWastageByDateRange(formattedStartDate, formattedEndDate, token);
      
      setWastageRecords(data);
      updateSummaryStats(data);
      setFilterType("week");
      setDateRange({ startDate, endDate });
      setShowFilterModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to filter by week. Please try again.");
    }
  };

  // Handle month filter (current month)
  const handleMonthFilter = async () => {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);
      
      const data = await fetchWastageByDateRange(formattedStartDate, formattedEndDate, token);
      
      setWastageRecords(data);
      updateSummaryStats(data);
      setFilterType("month");
      setDateRange({ startDate, endDate });
      setShowFilterModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to filter by month. Please try again.");
    }
  };

  // Reset filters
  const clearFilters = async () => {
    setFilterType("all");
    setSelectedCategory(null);
    await loadWastageRecords();
    setShowFilterModal(false);
    setShowCategoryModal(false);
  };

  // Load data on focus
  useFocusEffect(
    useCallback(() => {
      loadWastageRecords();
      loadCategories();
    }, [token])
  );

  // Get filter display text
  const getFilterDisplayText = () => {
    switch (filterType) {
      case "category":
        return `Category: ${selectedCategory}`;
      case "date":
        return `Date: ${selectedDate.toLocaleDateString()}`;
      case "week": {
        if (dateRange.startDate && dateRange.endDate) {
          return `Week: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`;
        }
        return "This Week";
      }
      case "month": {
        if (dateRange.startDate) {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return `Month: ${monthNames[dateRange.startDate.getMonth()]} ${dateRange.startDate.getFullYear()}`;
        }
        return "This Month";
      }
      default:
        return "All Time";
    }
  };

  // Render each wastage record in the new UI style
  const renderItem = ({ item }) => (
    <View style={styles.wastageItem}>
      <View style={styles.wastageIconContainer}>
        <Icon name="trash-outline" size={24} color="#fff" style={styles.wastageIcon} />
      </View>
      <View style={styles.wastageContent}>
        <Text style={styles.wastageTitle}>{item.item_name}</Text>
        <View style={styles.wastageDetailsRow}>
          <Text style={styles.wastageSubtitle}>
            <Icon name="cube-outline" size={14} color="#e74c3c" /> {item.wasted_quantity} {item.item_unit}
          </Text>
          <Text style={styles.wastageCategory}>
            {item.category}
          </Text>
        </View>
        <Text style={styles.wastageAmount}>
          ${parseFloat(item.wasted_money).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  // Header component with summary stats
  const WastageSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>
        <Icon name="pie-chart-outline" size={20} color="#e74c3c" /> Wastage Summary
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Icon name="hash" size={20} color="#e74c3c" style={styles.statIcon} />
          <Text style={styles.statNumber}>{summaryStats.totalItems}</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        
        <View style={styles.statBox}>
          <Icon name="cash-outline" size={20} color="#e74c3c" style={styles.statIcon} />
          <Text style={styles.statNumber}>${summaryStats.totalAmount.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Wasted</Text>
        </View>
      </View>
    </View>
  );

  // Filter badge/button
  const FilterBadge = () => (
    <View style={styles.filterOptionsContainer}>
      <TouchableOpacity 
        style={styles.filterBadge}
        onPress={() => setShowFilterModal(true)}
      >
        <Icon name="calendar-outline" size={16} color="#fff" />
        <Text style={styles.filterBadgeText}>Date Filter</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.filterBadge}
        onPress={() => setShowCategoryModal(true)}
      >
        <Icon name="list-outline" size={16} color="#fff" />
        <Text style={styles.filterBadgeText}>Categories</Text>
      </TouchableOpacity>
      
      {filterType !== "all" && (
        <TouchableOpacity 
          style={styles.clearFilterButton}
          onPress={clearFilters}
        >
          <Icon name="close-circle" size={20} color="#e74c3c" />
        </TouchableOpacity>
      )}
    </View>
  );
  
  // Current filter indicator
  const CurrentFilter = () => (
    <View style={styles.currentFilterContainer}>
      <Text style={styles.currentFilterText}>
        <Icon name="funnel-outline" size={16} color="#666" /> {getFilterDisplayText()}
      </Text>
    </View>
  );

  // Date filter modal
  const DateFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Date</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === "all" && styles.selectedFilterOption
              ]}
              onPress={clearFilters}
            >
              <Icon 
                name="albums-outline" 
                size={20} 
                color={filterType === "all" ? "#fff" : "#333"} 
              />
              <Text style={[
                styles.filterOptionText,
                filterType === "all" && styles.selectedFilterOptionText
              ]}>All Time</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === "date" && styles.selectedFilterOption
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon 
                name="calendar-outline" 
                size={20} 
                color={filterType === "date" ? "#fff" : "#333"} 
              />
              <Text style={[
                styles.filterOptionText,
                filterType === "date" && styles.selectedFilterOptionText
              ]}>By Date</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === "week" && styles.selectedFilterOption
              ]}
              onPress={handleWeekFilter}
            >
              <Icon 
                name="calendar-outline" 
                size={20} 
                color={filterType === "week" ? "#fff" : "#333"} 
              />
              <Text style={[
                styles.filterOptionText,
                filterType === "week" && styles.selectedFilterOptionText
              ]}>This Week</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === "month" && styles.selectedFilterOption
              ]}
              onPress={handleMonthFilter}
            >
              <Icon 
                name="calendar-outline" 
                size={20} 
                color={filterType === "month" ? "#fff" : "#333"} 
              />
              <Text style={[
                styles.filterOptionText,
                filterType === "month" && styles.selectedFilterOptionText
              ]}>This Month</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Category filter modal
  const CategoryFilterModal = () => (
    <Modal
      visible={showCategoryModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            <TouchableOpacity
              style={[
                styles.filterOption,
                filterType === "all" && styles.selectedFilterOption
              ]}
              onPress={clearFilters}
            >
              <Icon 
                name="albums-outline" 
                size={20} 
                color={filterType === "all" ? "#fff" : "#333"} 
              />
              <Text style={[
                styles.filterOptionText,
                filterType === "all" && styles.selectedFilterOptionText
              ]}>All Categories</Text>
            </TouchableOpacity>
            
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterOption,
                  filterType === "category" && selectedCategory === category && styles.selectedFilterOption
                ]}
                onPress={() => handleCategoryFilter(category)}
              >
                <Icon 
                  name="pricetag-outline" 
                  size={20} 
                  color={(filterType === "category" && selectedCategory === category) ? "#fff" : "#333"} 
                />
                <View style={styles.categoryOptionContent}>
                  <Text style={[
                    styles.filterOptionText,
                    filterType === "category" && selectedCategory === category && styles.selectedFilterOptionText
                  ]}>{category}</Text>
                  
                  {categoryWastage[category] && (
                    <Text style={[
                      styles.categoryStats,
                      filterType === "category" && selectedCategory === category && styles.selectedFilterOptionText
                    ]}>
                      ${categoryWastage[category].amount.toFixed(2)} • {categoryWastage[category].count} items
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.pageTitle}>Wastage List</Text> */}
      
      {/* Summary Stats */}
      <WastageSummary />
      
      {/* Filter Options */}
      <FilterBadge />
      
      {/* Current Filter */}
      <CurrentFilter />
      
      {/* Wastage List */}
      <FlatList
        data={wastageRecords}
        renderItem={renderItem}
        keyExtractor={(item) => item.wastage_id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No wastage records found</Text>
        }
      />
      
      
      {/* Filter Modals */}
      <DateFilterModal />
      <CategoryFilterModal />
      
      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              handleDateFilter(date);
            }
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e74c3c",
    marginBottom: 16,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statBox: {
    backgroundColor: "#ffebee",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  filterBadge: {
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  filterBadgeText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  clearFilterButton: {
    marginLeft: 4,
  },
  currentFilterContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currentFilterText: {
    color: "#666",
    fontSize: 14,
  },
  wastageItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  wastageIconContainer: {
    backgroundColor: "#e74c3c",
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  wastageContent: {
    flex: 1,
  },
  wastageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  wastageDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  wastageSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  wastageCategory: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#e74c3c",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  wastageAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  emptyList: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#e74c3c",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalBody: {
    maxHeight: "90%",
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f5f5f5",
  },
  selectedFilterOption: {
    backgroundColor: "#e74c3c",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
  selectedFilterOptionText: {
    color: "#fff",
    fontWeight: "600",
  },
  categoryOptionContent: {
    flex: 1,
    marginLeft: 12,
  },
  categoryStats: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
};

export default WastagePage;