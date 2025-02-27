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
import {
  addGroceryItem,
  fetchSuggestedItems,
  fetchSuggestedUnits,
} from "../../services/groceryApi";
import { getAllCategories } from "../../services/globalItemApi";

import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Animatable from "react-native-animatable";
import styles from "../../styles/AddGroceryPageStyles";
import { Picker } from "@react-native-picker/picker";

const AddGroceryPage = ({ navigation }) => {
  const { token } = useContext(UserContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedItems, setSuggestedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [customUnit, setCustomUnit] = useState("");
  const [suggestedUnits, setSuggestedUnits] = useState([]);

  const [purchasedQuantity, setPurchasedQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedCategory(fetchedCategories[0]);
      }
    };
    fetchCategories();
  }, []);

  const resetForm = () => {
    setSearchQuery("");
    setSelectedItem(null);
    setSuggestedItems([]);
    setUnits([]);
    setSelectedUnit("");
    setCustomUnit("");
    setSuggestedUnits([]);
    setPurchasedQuantity("");
    setPrice("");
    setExpiryDate(new Date());
    // Reset category to first available category
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  };

  const handleSearchChange = async (text) => {
    setSearchQuery(text);
    setSelectedItem(null);
    setUnits([]);
    setSelectedUnit("");
    setCustomUnit("");

    if (text.length > 1) {
      const items = await fetchSuggestedItems(text);
      setSuggestedItems(items);
    } else {
      setSuggestedItems([]);
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setSearchQuery(item.name);
    setSelectedCategory(item.category);
    setUnits(item.units);
    setSelectedUnit(item.units[0]);
    setCustomUnit("");
    setSuggestedItems([]);
  };

  const handleUnitSearchChange = async (text) => {
    setCustomUnit(text);
    setSelectedUnit("");

    if (!selectedItem && text.length > 1) {
      const units = await fetchSuggestedUnits(text);
      setSuggestedUnits(units);
    } else {
      setSuggestedUnits([]);
    }
  };

  const handleSelectUnit = (unit) => {
    setCustomUnit(unit);
    setSuggestedUnits([]);
  };

  const handleAddGrocery = async () => {
    if (
      !searchQuery ||
      (!selectedUnit && !customUnit) ||
      !purchasedQuantity ||
      !price
    ) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const groceryData = {
      name: searchQuery,
      unit: selectedUnit || customUnit,
      category: selectedItem ? selectedItem.category : selectedCategory,
      purchased_quantity: parseInt(purchasedQuantity),
      price: parseFloat(price),
      expiry_date: expiryDate.toISOString().split("T")[0],
    };

    try {
      await addGroceryItem(token, groceryData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Reset form instead of navigating away
        resetForm();
      }, 1200);
    } catch (error) {
      console.error("Error adding grocery item:", error.message);
      Alert.alert("Error", error.message || "Failed to add grocery item.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add Grocery</Text>

        <TextInput
          style={styles.input}
          placeholder="Search Item Name"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

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

        {!selectedItem && (
          <View>
            <Text style={styles.label}>Select Category</Text>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={setSelectedCategory}
              style={styles.picker}
              dropdownIconColor="#fff"
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        )}

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
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter Custom Unit"
              placeholderTextColor="#888"
              value={customUnit}
              onChangeText={handleUnitSearchChange}
            />

            {suggestedUnits.length > 0 && (
              <FlatList
                data={suggestedUnits}
                keyExtractor={(unit) => unit}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectUnit(item)}
                    style={styles.suggestionItemContainer}
                  >
                    <Text style={styles.suggestionItem}>{item}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionsContainer}
              />
            )}
          </View>
        )}

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

        <TextInput
          style={styles.input}
          placeholder="Price ($)"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9.]/g, ""))}
        />

        <TouchableOpacity
          style={styles.expiryDateButton}
          onPress={() => setDatePickerVisible(true)}
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
          onConfirm={(date) => {
            setExpiryDate(date);
            setDatePickerVisible(false);
          }}
          onCancel={() => setDatePickerVisible(false)}
          minimumDate={new Date()}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAddGrocery}
        >
          <Text style={styles.submitButtonText}>Add Grocery</Text>
        </TouchableOpacity>
      </ScrollView>

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