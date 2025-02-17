import React, { useState, useContext, useCallback } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  SectionList, 
  TouchableOpacity, 
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useFocusEffect } from "@react-navigation/native";
import { fetchGroceries, deleteGroceryItem, updateGroceryItem } from "../../services/groceryApi";
import { UserContext } from "../../contexts/UserContext";
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from "@react-native-community/datetimepicker";
import styles from '../../styles/InventoryPageStyles';

const InventoryPage = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [groceries, setGroceries] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [sortBy, setSortBy] = useState("expiry");
  
  // Modal state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedGrocery, setSelectedGrocery] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadGroceries = async () => {
    try {
      const data = await fetchGroceries(token);
      setGroceries(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load groceries. Please try again.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroceries();
    }, [token])
  );

  // Edit modal handlers
  const handleEdit = (item) => {
    setSelectedGrocery(item);
    setAvailableQuantity(item.available_quantity || 0);
    setExpiryDate(new Date(item.expiry_date || Date.now()));
    setIsEditModalVisible(true);
  };

  const handleDecreaseQuantity = () => {
    if (availableQuantity > 0.25) {
      setAvailableQuantity((prevQty) => parseFloat((prevQty - 0.25).toFixed(2)));
    } else {
      Alert.alert("Error", "Quantity cannot be less than 0.");
    }
  };

  const handleIncreaseQuantity = () => {
    setAvailableQuantity((prevQty) => parseFloat((prevQty + 0.25).toFixed(2)));
  };

  const handleUpdate = async () => {
    if (!availableQuantity) {
      Alert.alert("Error", "Available quantity cannot be zero.");
      return;
    }

    try {
      const updateData = {
        available_quantity: availableQuantity,
        expiry_date: expiryDate.toISOString().split("T")[0],
      };

      await updateGroceryItem(token, selectedGrocery.id, updateData);
      
      // Update local state
      await loadGroceries();
      
      Alert.alert("Success", "Grocery item updated successfully!");
      setIsEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update grocery item.");
    }
  };

  const filteredGroceries = groceries.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sortGroceries = (items) => {
    return [...items].sort((a, b) => {
      if (!a.expiry_date) return 1;
      if (!b.expiry_date) return -1;
      return new Date(a.expiry_date) - new Date(b.expiry_date);
    });
  };

  const groupGroceries = () => {
    const expiringSoon = [];
    const expiringInSomeTime = [];
    const hasTime = [];
    const now = new Date();

    filteredGroceries.forEach((item) => {
      const processedItem = {
        ...item,
        purchased_date: item.purchased_date || 'N/A',
        available_quantity: item.available_quantity || 0,
        price: item.price || 0,
      };

      if (item.expiry_date) {
        const expiryDate = new Date(item.expiry_date);
        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 2) {
          expiringSoon.push({ ...processedItem, diffDays });
        } else if (diffDays >= 3 && diffDays <= 7) {
          expiringInSomeTime.push({ ...processedItem, diffDays });
        } else {
          hasTime.push({ ...processedItem, diffDays });
        }
      } else {
        hasTime.push({ ...processedItem, diffDays: "N/A" });
      }
    });

    const sections = [];
    
    if (expiringSoon.length > 0) {
      sections.push({ title: "Soonest Expiration", data: sortGroceries(expiringSoon) });
    }
    if (expiringInSomeTime.length > 0) {
      sections.push({ title: "Expiring in Some Time", data: sortGroceries(expiringInSomeTime) });
    }
    if (hasTime.length > 0) {
      sections.push({ title: "Has Time", data: sortGroceries(hasTime) });
    }
    
    return sections;
  };

  const handleDelete = async (id) => {
    try {
      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this item?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              await deleteGroceryItem(token, id);
              loadGroceries();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to delete item. Please try again.");
    }
  };

  // const renderRightActions = (item) => {
  //   return (
  //     <View style={{ flexDirection: "row" }}>
  //       <TouchableOpacity
  //         style={[styles.actionButton, styles.editButton]}
  //         onPress={() => handleEdit(item)}
  //       >
  //         <Text style={styles.actionText}>Edit</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         style={[styles.actionButton, styles.deleteButton]}
  //         onPress={() => handleDelete(item.id)}
  //       >
  //         <Text style={styles.actionText}>Delete</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  const renderItem = ({ item }) => (
    <Menu>
      <MenuTrigger
        triggerOnLongPress
        customStyles={{
          triggerWrapper: {
            // No special styling needed - will use your existing itemCard styles
          },
        }}
      >
        <View style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <View style={styles.itemNameContainer}>
              <Icon name="cart-outline" size={24} style={styles.cartIcon} />
              <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <Text style={styles.itemPrice}>${Number(item.price).toFixed(2)}</Text>
          </View>
          <View style={styles.itemDetail}>
            <View style={styles.detailContainer}>
              <Icon name="cube-outline" size={20} style={styles.detailIcon} />
              <Text style={styles.detailValue}>
                {item.available_quantity} {item.unit}
              </Text>
            </View>
          </View>
          <View style={styles.itemDetail}>
            <View style={styles.detailContainer}>
              <Icon name="calendar-outline" size={20} style={styles.detailIcon} />
              <Text style={styles.detailValue}>
                {item.purchased_date ? new Date(item.purchased_date).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.itemDetail}>
            <View style={styles.detailContainer}>
              <Icon name="time-outline" size={20} style={styles.detailIcon} />
              <Text style={styles.detailValue}>
                {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}
                {item.diffDays !== 'N/A' && ` (in ${item.diffDays} days)`}
              </Text>
            </View>
          </View>
        </View>
      </MenuTrigger>
      <MenuOptions customStyles={{
        optionsContainer: styles.menuContainer,
        optionWrapper: styles.menuOption,
      }}>
        <MenuOption onSelect={() => handleEdit(item)}>
          <View style={styles.menuOptionContent}>
            <Icon name="create-outline" size={24} color="#007AFF" />
            <Text style={styles.menuOptionText}>Edit</Text>
          </View>
        </MenuOption>
        <MenuOption onSelect={() => handleDelete(item.id)}>
          <View style={styles.menuOptionContent}>
            <Icon name="trash-outline" size={24} color="#FF3B30" />
            <Text style={[styles.menuOptionText, styles.menuOptionTextDelete]}>Delete</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Grocery List</Text>
        </View>
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries..."
            value={filterQuery}
            onChangeText={setFilterQuery}
            placeholderTextColor="#666666"
          />
        </View>
      </View>
      
      <SectionList
        sections={groupGroceries()}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyList}>No groceries found</Text>
        }
        stickySectionHeadersEnabled={true}
      />

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {selectedGrocery?.name}</Text>

            {/* Quantity Controls */}
            <View style={styles.modalSection}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleDecreaseQuantity}
              >
                <Icon name="remove" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.quantityTextContainer}>
                <Text style={styles.quantityValue}>
                  {availableQuantity} {selectedGrocery?.unit}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={handleIncreaseQuantity}
              >
                <Icon name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Date Picker */}
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.dateContent}>
                <Icon name="calendar-outline" size={20} color="#666666" />
                <Text style={styles.dateLabel}>Expiry Date:</Text>
                <Text style={styles.dateValue}>
                  {expiryDate.toLocaleDateString()}
                </Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setExpiryDate(selectedDate);
                  }
                }}
              />
            )}

            {/* Action Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.modalButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InventoryPage;