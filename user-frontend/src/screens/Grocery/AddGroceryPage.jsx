import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { addGroceryItem } from "../../services/groceryApi";
import DateTimePicker from "@react-native-community/datetimepicker"; // Import Date Picker
import styles from "../../styles/AddGroceryPageStyles";

const AddGroceryPage = ({ navigation }) => {
  const { token } = useContext(UserContext); // Get token from UserContext

  const [itemIdentifier, setItemIdentifier] = useState("");
  const [purchasedPrice, setPurchasedPrice] = useState("");
  const [purchasedOn, setPurchasedOn] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [purchasedQuantity, setPurchasedQuantity] = useState("");
  const [packaging, setPackaging] = useState({
    quantity: "",
    unit: "",
    price: "",
  });

  const [showPurchasedOnPicker, setShowPurchasedOnPicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

const handleAddGrocery = async () => {
  if (
    !itemIdentifier ||
    !expiryDate ||
    !purchasedQuantity ||
    !packaging.quantity ||
    !packaging.unit ||
    !packaging.price
  ) {
    Alert.alert("Error", "Please fill all the required fields.");
    return;
  }

  const formatDateToLocal = (date) => {
    return date.toLocaleDateString("en-CA"); // Formats as YYYY-MM-DD
  };

  const groceryData = {
    item_identifier: itemIdentifier.trim(),
    purchased_price: parseFloat(purchasedPrice) || null,
    purchased_on: formatDateToLocal(purchasedOn),
    expiry_date: formatDateToLocal(expiryDate),
    purchased_quantity: parseInt(purchasedQuantity),
    available_quantity: parseInt(purchasedQuantity), // Initial value for available quantity
    packaging: {
      quantity: parseInt(packaging.quantity),
      unit: packaging.unit.trim(),
      price: parseFloat(packaging.price),
    },
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

      {/* Item Identifier */}
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemIdentifier}
        onChangeText={setItemIdentifier}
      />

      {/* Purchased Price */}
      <TextInput
        style={styles.input}
        placeholder="Purchased Price"
        keyboardType="numeric"
        value={purchasedPrice}
        onChangeText={setPurchasedPrice}
      />

      {/* Purchased On Date Picker */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPurchasedOnPicker(true)}
      >
        <Text style={styles.dateButtonText}>
          Purchased On: {purchasedOn.toDateString()}
        </Text>
      </TouchableOpacity>
      {showPurchasedOnPicker && (
        <DateTimePicker
          value={purchasedOn}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPurchasedOnPicker(false);
            if (selectedDate) setPurchasedOn(selectedDate);
          }}
        />
      )}

      {/* Expiry Date Picker */}
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

      {/* Purchased Quantity */}
      <TextInput
        style={styles.input}
        placeholder="Purchased Quantity"
        keyboardType="numeric"
        value={purchasedQuantity}
        onChangeText={setPurchasedQuantity}
      />

      {/* Packaging Details */}
      <Text style={styles.label}>Packaging Details</Text>
      <TextInput
        style={styles.input}
        placeholder="Packaging Quantity"
        keyboardType="numeric"
        value={packaging.quantity}
        onChangeText={(value) =>
          setPackaging((prev) => ({ ...prev, quantity: value }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Packaging Unit (e.g., medium)"
        value={packaging.unit}
        onChangeText={(value) =>
          setPackaging((prev) => ({ ...prev, unit: value }))
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Packaging Price"
        keyboardType="numeric"
        value={packaging.price}
        onChangeText={(value) =>
          setPackaging((prev) => ({ ...prev, price: value }))
        }
      />

      {/* Submit Button */}
      <Button title="Add Grocery" onPress={handleAddGrocery} />
    </View>
  );
};

export default AddGroceryPage;
