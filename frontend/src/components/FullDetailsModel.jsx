import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  fetchSuggestedCategories,
  fetchSuggestedUnits,
} from "../services/groceryApi";
import { getItemDetails } from "../services/globalItemApi";

const FullDetailsModal = ({
  visible,
  onClose,
  onSubmit,
  itemName,
  prePopulatedFields,
}) => {
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [category, setCategory] = useState("");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [unitSuggestions, setUnitSuggestions] = useState([]);
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);
  const [globalItemDetails, setGlobalItemDetails] = useState(null);

  // Set default values and fetch global item details when modal opens
  useEffect(() => {
    if (visible) {
      if (prePopulatedFields) {
        setUnit(prePopulatedFields.unit || "");
        setQuantity(prePopulatedFields.quantity || "");
      } else {
        setUnit("");
        setQuantity("");
      }
      setPrice("");
      setCategory("");
      // Set expiry date to tomorrow by default
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setExpiryDate(tomorrow);

      // Fetch global item details using the itemName
      (async () => {
        const details = await getItemDetails(itemName);
        if (details) {
          setGlobalItemDetails(details);
          setCategory(details.category); // Prepopulate category from global details
          // If unit is not already provided by prePopulatedFields, use preferred_unit
          if (!prePopulatedFields?.unit) {
            setUnit(details.preferred_unit);
          }
        } else {
          setGlobalItemDetails(null);
        }
      })();
    }
  }, [visible, prePopulatedFields, itemName]);

  const handleSubmit = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedExpiryDate = new Date(expiryDate);
    selectedExpiryDate.setHours(0, 0, 0, 0);

    if (!unit || !quantity || !price || !category) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (selectedExpiryDate <= today) {
      Alert.alert("Error", "Expiry date must be a future date");
      return;
    }

    onSubmit({
      unit,
      quantity,
      price,
      expiryDate: expiryDate.toISOString().split("T")[0],
      purchasedDate: new Date().toISOString().split("T")[0],
      category,
    });
  };

  const onExpiryDateChange = (event, selectedDate) => {
    setShowExpiryPicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      if (selected <= today) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setExpiryDate(tomorrow);
        Alert.alert("Invalid Date", "Expiry date must be a future date");
      } else {
        setExpiryDate(selectedDate);
      }
    }
  };

  // Category change handler (only if no global details are found)
  const handleCategoryChange = async (text) => {
    if (globalItemDetails) return;
    setCategory(text);
    if (text.length > 1) {
      const suggestions = await fetchSuggestedCategories(text);
      setCategorySuggestions(suggestions);
      setShowCategorySuggestions(true);
    } else {
      setShowCategorySuggestions(false);
    }
  };

  // Unit change handler: if global details exist, always show and filter its units
  const handleUnitChange = async (text) => {
    setUnit(text);
    if (globalItemDetails) {
      const filtered = globalItemDetails.units.filter((u) =>
        u.toLowerCase().includes(text.toLowerCase())
      );
      setUnitSuggestions(filtered);
      setShowUnitSuggestions(true);
    } else {
      if (text.length > 1) {
        const suggestions = await fetchSuggestedUnits(text);
        setUnitSuggestions(suggestions);
        setShowUnitSuggestions(true);
      } else {
        setShowUnitSuggestions(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Complete Details for {itemName}</Text>

          {/* Category Input */}
          <TextInput
            style={[
              styles.modalInput,
              globalItemDetails ? { backgroundColor: "#eee" } : {},
            ]}
            placeholder="Category (e.g., Dairy, Meat, Vegetables)"
            value={category}
            onChangeText={handleCategoryChange}
            editable={!globalItemDetails}
          />
          {!globalItemDetails && showCategorySuggestions && (
            <FlatList
              style={styles.suggestionContainer}
              data={categorySuggestions}
              keyExtractor={(item) => item.id?.toString() || item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    setCategory(item.name || item);
                    setShowCategorySuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{item.name || item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Unit Input with Suggestions (always shown) */}
          <TextInput
            style={styles.modalInput}
            placeholder="Unit (e.g., kg, pcs)"
            value={unit}
            onChangeText={handleUnitChange}
            onFocus={() => {
              if (globalItemDetails) handleUnitChange(unit);
            }}
          />
          {showUnitSuggestions && (
            <FlatList
              style={styles.suggestionContainer}
              data={unitSuggestions}
              keyExtractor={(item) => item.id?.toString() || item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => {
                    setUnit(item.name || item);
                    setShowUnitSuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionText}>{item.name || item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Quantity Input (always shown) */}
          <TextInput
            style={styles.modalInput}
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.modalInput}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          {/* Purchase Date */}
          <View style={styles.dateDisplay}>
            <Text style={styles.dateDisplayText}>
              Purchase Date: {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* Expiry Date Picker */}
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowExpiryPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Expiry Date: {expiryDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showExpiryPicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              minimumDate={new Date()}
              onChange={onExpiryDateChange}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  saveButton: {
    backgroundColor: "#FF4141",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f8f8f8",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  dateDisplay: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  dateDisplayText: {
    fontSize: 16,
    color: "#333",
  },
  suggestionContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default FullDetailsModal;
