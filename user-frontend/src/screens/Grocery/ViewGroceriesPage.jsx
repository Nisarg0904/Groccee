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
import { UserContext } from "../../contexts/UserContext";
import {
  fetchGroceries,
  updateGroceryItem,
  deleteGroceryItem,
} from "../../services/groceryApi";
import { fetchItemById } from "../../services/itemApi";
import styles from "../../styles/ViewGroceriesPageStyles";
import { useFocusEffect } from "@react-navigation/native";
import { BottomNav } from "../../components/BottomNav"; // Import BottomNav

const ViewGroceriesPage = ({ navigation, route }) => {
  const { token } = useContext(UserContext);
  const [groceries, setGroceries] = useState([]);
  const [selectedGrocery, setSelectedGrocery] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadGroceries = async () => {
        try {
          const groceryData = await fetchGroceries(token);
          const enhancedGroceries = await Promise.all(
            groceryData.map(async (grocery) => {
              const itemDetails = await fetchItemById(grocery.item_id, token);
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

<<<<<<< HEAD
  // Fetch groceries and enhance them with item details
  useEffect(() => {
    const loadGroceries = async () => {
      try {
        const groceryData = await fetchGroceries(token);
       const enhancedGroceries = await Promise.all(
         groceryData.map(async (grocery) => {
           const itemDetails = await fetchItemById(grocery.item_id, token);
           return {
             ...grocery,
             name: itemDetails.name,
             unit: itemDetails.unit,
             available_quantity: grocery.available_quantity || 0, // Ensure it’s always present
           };
         })
       );
        console.log(enhancedGroceries)
        setGroceries(enhancedGroceries);
      } catch (error) {
        console.error("Error loading groceries or items:", error);
      }
    };
    loadGroceries();
  }, [token]);

  // Handle the edit action
=======
>>>>>>> 93cedff (Frontend Added | Welcome | Profile | Bottom Bar | Grocery)
  const handleEdit = (item) => {
    setSelectedGrocery(item);
    setIsEditModalVisible(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>My Groceries</Text>
        <FlatList
          data={groceries}
          keyExtractor={(item) => item.grocery_item_id.toString()}
          renderItem={({ item }) => (
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
              <TouchableOpacity style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                  Quantity: {item.available_quantity} {item.unit}
                </Text>
                <Text style={styles.itemDetail}>Expiry Date: {item.expiry_date}</Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      </View>

      {/* Bottom Navigation Bar */}
      <BottomNav navigation={navigation} route={route} />
    </View>
  );
};

export default ViewGroceriesPage;
