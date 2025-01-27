import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { updateGroceryItem } from "../../services/groceryApi";
import styles from "../../styles/EditGroceryPageStyles";

const EditGroceryPage = ({ route, navigation }) => {
  const { token } = useContext(UserContext);
  const { item } = route.params;

  // Safely initialize state with default values or empty strings
  const [availableQuantity, setAvailableQuantity] = useState(
    item.available_quantity != null ? item.available_quantity.toString() : ""
  );
  const [expiryDate, setExpiryDate] = useState(item.expiry_date || "");
  const [purchasedPrice, setPurchasedPrice] = useState(
    item.purchased_price != null ? item.purchased_price.toString() : ""
  );

  const handleUpdate = async () => {
    if (!availableQuantity && !expiryDate && !purchasedPrice) {
      Alert.alert("Error", "Please provide at least one field to update.");
      return;
    }

    try {
      const updateData = {
        available_quantity: availableQuantity
          ? parseInt(availableQuantity)
          : undefined,
        expiry_date: expiryDate || undefined,
        purchased_price: purchasedPrice
          ? parseFloat(purchasedPrice)
          : undefined,
      };

      const updatedGrocery = await updateGroceryItem(
        token,
        item.grocery_item_id,
        updateData
      );

      Alert.alert("Success", "Grocery item updated successfully!");

      // Pass the updated data back and navigate
      navigation.navigate("ViewGroceries", { updatedGrocery });
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update grocery item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Grocery</Text>

      {/* Available Quantity */}
      <TextInput
        style={styles.input}
        placeholder="Available Quantity"
        value={availableQuantity}
        keyboardType="numeric"
        onChangeText={setAvailableQuantity}
      />

      {/* Expiry Date */}
      <TextInput
        style={styles.input}
        placeholder="Expiry Date (YYYY-MM-DD)"
        value={expiryDate}
        onChangeText={setExpiryDate}
      />

      {/* Purchased Price */}
      <TextInput
        style={styles.input}
        placeholder="Purchased Price"
        keyboardType="numeric"
        value={purchasedPrice}
        onChangeText={setPurchasedPrice}
      />

      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

export default EditGroceryPage;
