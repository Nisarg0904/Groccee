import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { addGroceryItem } from "../../services/groceryApi";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from "../../styles/AddGroceryPageStyles";

const AddGroceryPage = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({
    itemIdentifier: "",
    purchasedPrice: "",
    purchasedOn: new Date(),
    expiryDate: new Date(),
    purchasedQuantity: "",
    packaging: {
      quantity: "",
      unit: "",
      price: "",
    },
  });

  const [showPurchasedOnPicker, setShowPurchasedOnPicker] = useState(false);
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

  const handleAddGrocery = async () => {
    if (
      !formData.itemIdentifier ||
      !formData.purchasedQuantity ||
      !formData.packaging.quantity ||
      !formData.packaging.unit ||
      !formData.packaging.price
    ) {
      Alert.alert("Error", "Please fill all the required fields");
      return;
    }

<<<<<<< HEAD
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
=======
    const groceryData = {
      item_identifier: formData.itemIdentifier.trim(),
      purchased_price: parseFloat(formData.purchasedPrice) || null,
      purchased_on: formData.purchasedOn.toISOString().split("T")[0],
      expiry_date: formData.expiryDate.toISOString().split("T")[0],
      purchased_quantity: parseInt(formData.purchasedQuantity),
      available_quantity: parseInt(formData.purchasedQuantity),
      packaging: {
        quantity: parseInt(formData.packaging.quantity),
        unit: formData.packaging.unit.trim(),
        price: parseFloat(formData.packaging.price),
      },
    };

    try {
      await addGroceryItem(token, groceryData);
      Alert.alert("Success", "Item added successfully!");
      navigation.navigate("MainMenu");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to add item");
    }
>>>>>>> 93cedff (Frontend Added | Welcome | Profile | Bottom Bar | Grocery)
  };

  const DateButton = ({ date, onPress, label }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={onPress}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
        <Ionicons name="calendar-outline" size={20} color="#F8F8FF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 
        Use `contentContainerStyle` for the scrollable area.
        This way, `paddingBottom: 80` from scrollContent 
        ensures the bottom button isn't clipped.
      */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Grocery Item</Text>

        <Text style={styles.groupTitle}>Basic Details</Text>

        <Text style={styles.label}>Item Name*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          placeholderTextColor="#666666"
          value={formData.itemIdentifier}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, itemIdentifier: text }))
          }
        />

        <Text style={styles.label}>Purchase Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          placeholderTextColor="#666666"
          keyboardType="numeric"
          value={formData.purchasedPrice}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, purchasedPrice: text }))
          }
        />

        <DateButton
          date={formData.purchasedOn}
          onPress={() => setShowPurchasedOnPicker(true)}
          label="Purchase Date"
        />

        <DateButton
          date={formData.expiryDate}
          onPress={() => setShowExpiryDatePicker(true)}
          label="Expiry Date"
        />

        <Text style={styles.label}>Purchase Quantity*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity"
          placeholderTextColor="#666666"
          keyboardType="numeric"
          value={formData.purchasedQuantity}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, purchasedQuantity: text }))
          }
        />

        <Text style={styles.groupTitle}>Packaging Details</Text>

        <Text style={styles.label}>Package Quantity*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter package quantity"
          placeholderTextColor="#666666"
          keyboardType="numeric"
          value={formData.packaging.quantity}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              packaging: { ...prev.packaging, quantity: text },
            }))
          }
        />

        <Text style={styles.label}>Package Unit*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter unit (e.g., medium, large)"
          placeholderTextColor="#666666"
          value={formData.packaging.unit}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              packaging: { ...prev.packaging, unit: text },
            }))
          }
        />

        <Text style={styles.label}>Package Price*</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter package price"
          placeholderTextColor="#666666"
          keyboardType="numeric"
          value={formData.packaging.price}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              packaging: { ...prev.packaging, price: text },
            }))
          }
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleAddGrocery}>
          <Text style={styles.submitText}>Add Item</Text>
        </TouchableOpacity>

        {showPurchasedOnPicker && (
          <DateTimePicker
            value={formData.purchasedOn}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPurchasedOnPicker(false);
              if (selectedDate) {
                setFormData((prev) => ({ ...prev, purchasedOn: selectedDate }));
              }
            }}
          />
        )}

        {showExpiryDatePicker && (
          <DateTimePicker
            value={formData.expiryDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowExpiryDatePicker(false);
              if (selectedDate) {
                setFormData((prev) => ({ ...prev, expiryDate: selectedDate }));
              }
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default AddGroceryPage;
