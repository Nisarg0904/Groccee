import React, { useState, useContext, useCallback } from "react";
// import moment from 'moment';
import { 
  View, 
  Text, 
  TextInput, 
  SectionList, 
  FlatList,
  TouchableOpacity, 
  Alert,
  Modal,
  Pressable,
  ScrollView,
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
  const [statusFilter, setStatusFilter] = useState('all');
  
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
    const getReductionAmount = (unit, currentQuantity) => {
      switch(unit?.toLowerCase()) {
        case 'kg':
        case 'l':
        case 'liter':
        case 'litre':
          return 0.5;
        case 'gram':
        case 'ml':
          return 50;
        case 'pcs':
        case 'pieces':
        case 'units':
          return 1;
        default:
          return currentQuantity >= 10 ? 1 : 0.25;
      }
    };
  
    const reductionAmount = getReductionAmount(selectedGrocery?.unit, availableQuantity);
    const newQuantity = Math.max(0, availableQuantity - reductionAmount);
    setAvailableQuantity(parseFloat(newQuantity.toFixed(1)));
  };

  // const handleIncreaseQuantity = () => {
  //   setAvailableQuantity((prevQty) => parseFloat((prevQty + 0.25).toFixed(2)));
  // };

  const handleUpdate = async () => {
    try {
      const updateData = {
        available_quantity: availableQuantity,
        expiry_date: expiryDate.toISOString().split("T")[0],
        status: availableQuantity === 0 ? "used" : selectedGrocery.status
      };
  
      await updateGroceryItem(token, selectedGrocery.id, updateData);
      
      // Update local state
      await loadGroceries();
      
      Alert.alert(
        "Success", 
        availableQuantity === 0 
          ? "Item marked as used and removed from inventory"
          : "Grocery item updated successfully!"
      );
      setIsEditModalVisible(false);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update grocery item.");
    }
  };
  

  // const filteredGroceries = groceries.filter(
  //   (item) =>
  //     item.name && item.name.toLowerCase().includes(filterQuery.toLowerCase())
  // );

  const sortGroceries = (items) => {
    return [...items].sort((a, b) => {
      if (!a.expiry_date) return 1;
      if (!b.expiry_date) return -1;
      return new Date(a.expiry_date) - new Date(b.expiry_date);
    });
  };

  const getFilteredGroceries = () => {
    // First, filter based on search query
    let filtered = groceries.filter(
      (item) => item.name && item.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  
    // Calculate days difference and add it to each item
    filtered = filtered.map(item => {
      let diffDays = null;
      if (item.expiry_date) {
        const now = new Date();
        const expiryDate = new Date(item.expiry_date);
        diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      }
      return { ...item, diffDays };
    });
  
    // Then apply status filter
      switch(statusFilter) {
        case 'used':
          filtered = filtered.filter(item => item.status === 'used');
          break;
        case 'soonest':
          filtered = filtered.filter(item => 
            item.diffDays !== null && item.diffDays <= 2 && item.status !== 'used'
          );
          break;
        case 'expiring':
          filtered = filtered.filter(item => 
            item.diffDays !== null && item.diffDays > 2 && item.diffDays <= 7 && item.status !== 'used'
          );
          break;
        case 'hasTime':
          filtered = filtered.filter(item => 
            item.diffDays !== null && item.diffDays > 7 && item.status !== 'used'
          );
          break;
        case 'all':
            filtered = filtered.filter(item => item.status !== 'used');
            break;
    }
  
    return filtered;
  };
  


  // const handleDelete = async (id) => {
  //   try {
  //     Alert.alert(
  //       "Confirm Deletion",
  //       "Are you sure you want to delete this item?",
  //       [
  //         { text: "Cancel", style: "cancel" },
  //         {
  //           text: "Delete",
  //           style: "destructive",
  //           onPress: async () => {
  //             await deleteGroceryItem(token, id);
  //             loadGroceries();
  //           },
  //         },
  //       ]
  //     );
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to delete item. Please try again.");
  //   }
  // };

  const handleMarkAsUsed = async (id) => {
    try {
      Alert.alert(
        "Confirm Action",
        "Are you sure you want to mark this item as used?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Mark as Used",
            style: "default",
            onPress: async () => {
              const updateData = {
                available_quantity: 0,
                status: "used"
              };
              await updateGroceryItem(token, id, updateData);
              await loadGroceries();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update item. Please try again.");
    }
  };

  //Filter Bar
  const FilterBar = () => (
    <View style={styles.filterBar}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('all')}
        >
          <Text style={[styles.filterText, statusFilter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'soonest' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('soonest')}
        >
          <Text style={[styles.filterText, statusFilter === 'soonest' && styles.filterTextActive]}>
            Soonest Expiration
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'expiring' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('expiring')}
        >
          <Text style={[styles.filterText, statusFilter === 'expiring' && styles.filterTextActive]}>
            Expiring Soon
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'hasTime' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('hasTime')}
        >
          <Text style={[styles.filterText, statusFilter === 'hasTime' && styles.filterTextActive]}>
            Has Time
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity 
          style={[styles.filterButton, statusFilter === 'used' && styles.filterButtonActive]}
          onPress={() => setStatusFilter('used')}
        >
          <Text style={[styles.filterText, statusFilter === 'used' && styles.filterTextActive]}>
            Used
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }) => (
    <Menu>
      <MenuTrigger
        triggerOnLongPress
        customStyles={{
          triggerWrapper: {
            // No special styling needed
          },
        }}
      >
       <View style={styles.itemCard}>
        {item.status === 'used' && <View style={styles.usedBadge} />}
        <View style={styles.itemContent}>
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
        {item.status !== 'used' && (
          <MenuOption onSelect={() => handleMarkAsUsed(item.id)}>
            <View style={styles.menuOptionContent}>
              <Icon name="trash-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuOptionText, styles.menuOptionTextDelete]}>Used</Text>
            </View>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        <FilterBar />
      </View>
      
      <FlatList
      data={getFilteredGroceries()}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={
        <Text style={styles.emptyList}>No groceries found</Text>
      }
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
            <Text style={styles.modalTitle}>Track Usage: {selectedGrocery?.name}</Text>

            {/* Current Status */}
            <View style={styles.statusContainer}>
              <Text style={styles.statusLabel}>Current Status:</Text>
              <View style={[styles.statusBadge, { backgroundColor: selectedGrocery?.status === 'used' ? '#9E9E9E' : '#4CAF50' }]}>
                <Text style={styles.statusText}>{selectedGrocery?.status?.toUpperCase()}</Text>
              </View>
            </View>

            {/* Quantity Section */}
            <View style={styles.modalSection}>
            

              {/* Quantity Controls */}
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    availableQuantity === 0 && styles.quantityButtonDisabled
                  ]}
                  onPress={handleDecreaseQuantity}
                  disabled={availableQuantity === 0}
                >
                  <Icon name="remove" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.quantityTextContainer}>
                  <Text style={styles.quantityValue}>
                    {availableQuantity} {selectedGrocery?.unit}
                  </Text>
                  <Text style={styles.quantityLabel}>Remaining Amount</Text>
                </View>
              </View>

              {/* Warning when quantity is 0 */}
              {availableQuantity === 0 && (
                <View style={styles.warningBox}>
                  <Icon name="warning-outline" size={20} color="#FF9500" />
                  <Text style={styles.warningText}>
                    This item will be marked as "USED" and removed from inventory when you save
                  </Text>
                </View>
              )}
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
                <Text style={styles.modalButtonText}>
                  {availableQuantity === 0 ? 'Mark as Used' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InventoryPage;