import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { UserContext } from "../contexts/UserContext";
import {
  fetchGroceries,
  updateGroceryItem,
  deleteGroceryItem,
} from "../services/groceryApi";
import { fetchItemById } from "../services/itemApi";
import styles from "../styles/ViewGroceriesPageStyles";
  import { useFocusEffect } from "@react-navigation/native";


const ViewGroceriesPage = () => {
  const { token } = useContext(UserContext);
  const [groceries, setGroceries] = useState([]);
  const [selectedGrocery, setSelectedGrocery] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const [expiryDate, setExpiryDate] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");


  useFocusEffect(
    React.useCallback(() => {
      const loadGroceries = async () => {
        try {
          const groceryData = await fetchGroceries(token);
          const enhancedGroceries = await Promise.all(
            groceryData.map(async (grocery) => {
              const itemDetails = await fetchItemById(grocery.item_id);
              return {
                ...grocery,
                name: itemDetails.name,
                unit: itemDetails.unit,
              };
            })
          );
          setGroceries(enhancedGroceries);
        } catch (error) {
          console.error("Error loading groceries or items:", error);
        }
      };

      loadGroceries();
    }, [token])
  );

  // Fetch groceries and enhance them with item details
  useEffect(() => {
    const loadGroceries = async () => {
      try {
        const groceryData = await fetchGroceries(token);
       const enhancedGroceries = await Promise.all(
         groceryData.map(async (grocery) => {
           const itemDetails = await fetchItemById(grocery.item_id);
           return {
             ...grocery,
             name: itemDetails.name,
             unit: itemDetails.unit,
             available_quantity: grocery.available_quantity || 0, // Ensure it’s always present
           };
         })
       );

        setGroceries(enhancedGroceries);
      } catch (error) {
        console.error("Error loading groceries or items:", error);
      }
    };
    loadGroceries();
  }, [token]);

  // Handle the edit action
  const handleEdit = (item) => {
    setSelectedGrocery(item);
    setExpiryDate(item.expiry_date);
    setAvailableQuantity(item.available_quantity.toString());
    setIsEditModalVisible(true);
  };

  // Save the edited grocery item
const handleSave = async () => {
  try {
    const updatedGrocery = await updateGroceryItem(
      token,
      selectedGrocery.grocery_item_id,
      {
        expiry_date: expiryDate,
        available_quantity: parseInt(availableQuantity),
      }
    );

    setGroceries((prev) =>
      prev.map((grocery) =>
        grocery.grocery_item_id === selectedGrocery.grocery_item_id
          ? {
              ...grocery,
              expiry_date: updatedGrocery.expiry_date || grocery.expiry_date,
              available_quantity:
                updatedGrocery.available_quantity !== undefined
                  ? updatedGrocery.available_quantity
                  : grocery.available_quantity,
            }
          : grocery
      )
    );

    setIsEditModalVisible(false);
    Alert.alert("Success", "Grocery item updated successfully!");
  } catch (error) {
    console.error("Error updating grocery item:", error.message);
    Alert.alert("Error", "Failed to update grocery item.");
  }
};


  const handleDelete = async (id) => {
    try {
      await deleteGroceryItem(token, id);
      setGroceries((prev) =>
        prev.filter((grocery) => grocery.grocery_item_id !== id)
      );
      Alert.alert("Success", "Grocery item deleted successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete grocery item.");
    }
  };

  const renderGroceryItem = ({ item }) => (
    <Swipeable
      renderRightActions={() => (
        <View style={styles.swipeableContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item.grocery_item_id)}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    >
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setSelectedGrocery(item);
          setIsDetailsModalVisible(true);
        }}
      >
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetail}>
          Purchased Quantity: {item.purchased_quantity} {item.unit}
        </Text>
        <Text style={styles.itemDetail}>
          Available Quantity: {item.available_quantity} {item.unit}
        </Text>
        <Text style={styles.itemDetail}>Expiry Date: {item.expiry_date}</Text>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Groceries</Text>
      <FlatList
        data={groceries}
        keyExtractor={(item) => item.grocery_item_id.toString()}
        renderItem={renderGroceryItem}
      />

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.popupContainer}>
          <Text style={styles.popupTitle}>Edit Grocery</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="Expiry Date"
          />
          <TextInput
            style={styles.input}
            value={availableQuantity}
            onChangeText={setAvailableQuantity}
            placeholder="Available Quantity"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.popupButton} onPress={handleSave}>
            <Text style={styles.popupButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.popupButton}
            onPress={() => setIsEditModalVisible(false)}
          >
            <Text style={styles.popupButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ViewGroceriesPage;
