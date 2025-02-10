import React, { useState, useContext } from "react";
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
import { addGroceryItem, fetchSuggestedItems } from "../../services/groceryApi"; // Import the new API helpers
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from "react-native-animatable";
import styles from "../../styles/AddGroceryPageStyles";
import { Picker } from "@react-native-picker/picker";

const AddGroceryPage = ({ navigation }) => {
  const { token } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useState(""); // Live search input
  const [suggestedItems, setSuggestedItems] = useState([]); // Suggested items
  const [selectedItem, setSelectedItem] = useState(null); // Chosen item
  const [units, setUnits] = useState([]); // Available units
  const [selectedUnit, setSelectedUnit] = useState(""); // User-selected unit

  const [purchasedQuantity, setPurchasedQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  // State to control the success animation overlay
  const [showSuccess, setShowSuccess] = useState(false);

  /** 🔎 Fetch matching items based on user input */
  const handleSearchChange = async (text) => {
    setSearchQuery(text);
    if (text.length > 1) {
      const items = await fetchSuggestedItems(text);
      setSuggestedItems(items);
    } else {
      setSuggestedItems([]);
    }
  };

  /** ✅ Select an item and update available units */
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchQuery(item.name); // Set the name in the search field
    setUnits(item.units); // Update available units
    setSelectedUnit(item.units[0]); // Default to first unit
    setSuggestedItems([]); // Hide suggestions
  };

  /** 🛒 Add grocery item to database */
  const handleAddGrocery = async () => {
    if (!selectedItem || !selectedUnit || !purchasedQuantity || !price) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const groceryData = {
      name: selectedItem.name,
      unit: selectedUnit,
      category: selectedItem.category,
      purchased_quantity: parseInt(purchasedQuantity),
      price: parseFloat(price),
      expiry_date: expiryDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
    };

    try {
      await addGroceryItem(token, groceryData);
      // Instead of an alert, display an animated success message.
      setShowSuccess(true);
      // After a short delay, navigate to MainMenu.
      setTimeout(() => {
        navigation.navigate("MainMenu");
      }, 1500);
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

        {/* 🏷️ Display Available Units */}
        {selectedItem && (
          <View>
            <Text style={styles.label}>Select Unit</Text>
            <Picker
              selectedValue={selectedUnit}
              onValueChange={(value) => setSelectedUnit(value)}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              {units.map((unit, index) => (
                <Picker.Item key={index} label={unit} value={unit} />
              ))}
            </Picker>
          </View>
        )}

        {/* 💰 Price in dollars */}
        <TextInput
          style={styles.input}
          placeholder="Price ($)"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ""))}
        />

        {/* 📅 Expiry Date with Modal Date Picker */}
        <TouchableOpacity
          style={styles.expiryDateButton}
          onPress={showDatePicker}
        >
          <Text style={styles.expiryDateButtonText}>
            Expiry Date: {expiryDate.toDateString()}
          </Text>
          <MaterialCommunityIcons name="calendar" size={24} color="#f39c12" />
        </TouchableOpacity>

        {/* Unified Modal Date Picker */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={expiryDate}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
        />

        {/* 📦 Purchased Quantity (numbers only) */}
        <TextInput
          style={styles.input}
          placeholder="Purchased Quantity"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={purchasedQuantity}
          onChangeText={(text) => setPurchasedQuantity(text.replace(/[^0-9]/g, ""))}
        />

        {/* 🛒 Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleAddGrocery}>
          <Text style={styles.submitButtonText}>Add Grocery</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Animated Success Overlay */}
      {showSuccess && (
        <Animatable.View
          animation="bounceIn"
          duration={800}
          style={styles.successOverlay}
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