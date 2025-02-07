import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { addGroceryItem, fetchSuggestedItems } from "../../services/groceryApi"; // Import the new API helpers
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker"; // Import picker for unit selection
import styles from "../../styles/AddGroceryPageStyles";

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
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

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
    setSearchQuery(item.name); // Set the name in input
    setUnits(item.units); // Set available units
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
      Alert.alert("Success", "Grocery item added successfully!");
      navigation.navigate("MainMenu");
    } catch (error) {
      console.error("Error adding grocery item:", error.message);
      Alert.alert("Error", error.message || "Failed to add grocery item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Grocery</Text>

      {/* 🔎 Search for item */}
      <TextInput
        style={styles.input}
        placeholder="Search Item Name"
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      {/* Show search suggestions */}
      {suggestedItems.length > 0 && (
        <FlatList
          data={suggestedItems}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectItem(item)}>
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
          >
            {units.map((unit, index) => (
              <Picker.Item key={index} label={unit} value={unit} />
            ))}
          </Picker>
        </View>
      )}

      {/* 💰 Price */}
      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* 📅 Expiry Date */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowExpiryDatePicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Expiry Date: {expiryDate.toDateString()}
        </Text>
      </TouchableOpacity>
      {showExpiryDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowExpiryDatePicker(false);
            if (selectedDate) setExpiryDate(selectedDate);
          }}
        />
      )}

      {/* 📦 Purchased Quantity */}
      <TextInput
        style={styles.input}
        placeholder="Purchased Quantity"
        keyboardType="numeric"
        value={purchasedQuantity}
        onChangeText={setPurchasedQuantity}
      />

      {/* 🛒 Submit Button */}
      <Button title="Add Grocery" onPress={handleAddGrocery} />
    </View>
  );
};

export default AddGroceryPage;
