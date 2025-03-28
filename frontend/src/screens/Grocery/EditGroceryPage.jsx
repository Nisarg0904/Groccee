import React, { useState, useContext } from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { UserContext } from "../../contexts/UserContext";
import { updateGroceryItem } from "../../services/groceryApi";
import styles from "../../styles/EditGroceryPageStyles";

const EditGroceryPage = ({ route, navigation }) => {
  const { token } = useContext(UserContext);
  const { item } = route.params;

  const [availableQuantity, setAvailableQuantity] = useState(
    item.available_quantity || 0
  );
  const [expiryDate, setExpiryDate] = useState(new Date(item.expiry_date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDecreaseQuantity = () => {
    if (availableQuantity > 0.25) {
      setAvailableQuantity((prevQty) =>
        parseFloat((prevQty - 0.25).toFixed(2))
      );
    } else {
      Alert.alert("Error", "Quantity cannot be less than 0.");
    }
  };

  const handleUpdate = async () => {
    if (!availableQuantity) {
      Alert.alert("Error", "Available quantity cannot be zero.");
      return;
    }

    try {
      const updateData = {
        available_quantity: availableQuantity,
        expiry_date: expiryDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      };

      await updateGroceryItem(token, item.grocery_item_id, updateData);

      Alert.alert("Success", "Grocery item updated successfully!");
      navigation.navigate("ViewGroceries", { updatedItem: updateData });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update grocery item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Grocery</Text>

      {/* Available Quantity */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleDecreaseQuantity}
        >
          <Text style={styles.quantityText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityValue}>{availableQuantity} kg</Text>
      </View>

      {/* Expiry Date Picker */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePicker}
      >
        <Text style={styles.dateText}>
          Expiry Date: {expiryDate.toISOString().split("T")[0]}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={expiryDate}
          mode="date"
          display="calendar"
          minimumDate={new Date()} // Prevents selecting past dates
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setExpiryDate(selectedDate);
            }
          }}
        />
      )}

      {/* Update Button */}
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

export default EditGroceryPage;
