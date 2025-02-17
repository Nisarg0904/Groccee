import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import { addGroceryItem, fetchSuggestedItems } from "../../services/groceryApi";
import { getAllCategories } from "../../services/globalItemApi"; // Fetch all categories
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from "react-native-animatable";
import styles from "../../styles/AddGroceryPageStyles";
import { Picker } from "@react-native-picker/picker";

const AddGroceryPage = ({ navigation }) => {
  const { token } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useState(""); // User input
  const [suggestedItems, setSuggestedItems] = useState([]); // Suggested items from API
  const [selectedItem, setSelectedItem] = useState(null); // Selected item from suggestions

  const [units, setUnits] = useState([]); // Available units (Fetched or manually added)
  const [selectedUnit, setSelectedUnit] = useState(""); // Selected unit
  const [customUnit, setCustomUnit] = useState(""); // Custom unit input

  const [purchasedQuantity, setPurchasedQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false); // Success animation
  const [categories, setCategories] = useState([]); // Available categories
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category for custom items

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  /** 🔎 Fetch matching items based on user input */
  const handleSearchChange = async (text) => {
    setSearchQuery(text);
    setSelectedItem(null); // Reset selected item when user types

    if (text.length > 1) {
      const items = await fetchSuggestedItems(text);
      setSuggestedItems(items);
    } else {
      setSuggestedItems([]);
    }
  };

  /** ✅ Select an item from suggestions */
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchQuery(item.name); // Set item name in input
    setUnits(item.units); // Set available units
    setSelectedUnit(item.units[0]); // Select first unit
    setSuggestedItems([]); // Hide suggestions
  };

  /** 🛒 Add grocery item to database */
  const handleAddGrocery = async () => {
    if (!searchQuery || !selectedUnit || !purchasedQuantity || !price) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const groceryData = {
      name: searchQuery,
      unit: selectedUnit || customUnit,
      category: selectedItem ? selectedItem.category : selectedCategory,
      purchased_quantity: parseInt(purchasedQuantity),
      price: parseFloat(price),
      expiry_date: expiryDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };

    try {
      await addGroceryItem(token, groceryData);
      setShowSuccess(true);
      
      // Hide animation after 1.2 seconds, then navigate after 0.3 more seconds
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {
          navigation.navigate("Home");
        }, 300);
      }, 1200);
      
    } catch (error) {
      console.error("Error adding grocery item:", error.message);
      Alert.alert("Error", error.message || "Failed to add grocery item.");
    }
  };

  // Date Picker functions
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirmDate = (date) => {
    setExpiryDate(date);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Grocery</Text>

        {/* 🔎 Search for item */}
        <TextInput
          style={styles.input}
          placeholder="Search Item Name"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

        {/* Show search suggestions */}
        {suggestedItems.length > 0 && (
          <FlatList
            data={suggestedItems}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectItem(item)}
                style={styles.suggestionItemContainer}
              >
                <Text style={styles.suggestionItem}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={styles.suggestionsContainer}
          />
        )}

        {/* 🏷️ Category (Non-Editable for Suggested Items) */}
        {selectedItem && (
          <View>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.disabledInput}
              value={selectedItem.category}
              editable={false}
            />
          </View>
        )}

        {/* ✅ Allow selecting category for custom items */}
        {!selectedItem && (
          <View>
            <Text style={styles.label}>Select Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        )}

        {/* 🏷️ Units - Either from suggestion or custom */}
        <Text style={styles.label}>Select Unit</Text>
        {selectedItem ? (
          <Picker
            selectedValue={selectedUnit}
            onValueChange={setSelectedUnit}
            style={styles.picker}
          >
            {units.map((unit) => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Enter Custom Unit"
            placeholderTextColor="#888"
            value={customUnit}
            onChangeText={setCustomUnit}
          />
        )}

        {/* 💰 Price */}
        <TextInput
          style={styles.input}
          placeholder="Price ($)"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ""))}
        />

        {/* 📅 Expiry Date */}
        <TouchableOpacity
          style={styles.expiryDateButton}
          onPress={showDatePicker}
        >
          <Text style={styles.expiryDateButtonText}>
            Expiry Date: {expiryDate.toDateString()}
          </Text>
          <MaterialCommunityIcons name="calendar" size={24} color="#f39c12" />
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={expiryDate}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />

        {/* 📦 Purchased Quantity */}
        <TextInput
          style={styles.input}
          placeholder="Purchased Quantity"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={purchasedQuantity}
          onChangeText={(text) =>
            setPurchasedQuantity(text.replace(/[^0-9]/g, ""))
          }
        />

        {/* 🛒 Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddGrocery}
        >
          <Text style={styles.submitButtonText}>Add Grocery</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Animation */}
      {showSuccess && (
  <Animatable.View
    animation="bounceIn"
    duration={800}
    style={styles.successOverlay}
    useNativeDriver
  >
    <MaterialCommunityIcons
      name="check-circle-outline"
      size={60}
      color="#f39c12"
    />
    <Text style={styles.successText}>Grocery Added Successfully!</Text>
  </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default AddGroceryPage;