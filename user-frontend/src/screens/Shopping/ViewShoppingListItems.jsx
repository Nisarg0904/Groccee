// screens/Shopping/ShoppingListItemsPage.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
  Modal,
  TextInput,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../contexts/UserContext';
import { 
  fetchShoppingListItems, 
  updateShoppingListItem, 
  deleteShoppingListItem,
  createGroceryItemFromShoppingItem,
} from '../../services/shoppingItemApi';
import AddItemsModal from './AddShoppingListItemPage';
import FullDetailsModal from '../../components/FullDetailsModel';

const ShoppingListItemsPage = ({ route, navigation }) => {
  const [addItemsModalVisible, setAddItemsModalVisible] = useState(false);
  const [fullDetailsModalVisible, setFullDetailsModalVisible] = useState(false);
  const [selectedBoughtItem, setSelectedBoughtItem] = useState(null);
  const { listId } = route.params;
  const { token } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('');

  const fetchItems = async () => {
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchShoppingListItems(listId, token);
      console.log('Fetched items:', data); // Add this for debugging
      setItems(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch shopping list items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [listId, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditQuantity(item.quantity?.toString() || '');
    setEditUnit(item.unit || '');
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Item name cannot be empty');
      return;
    }

    try {
      const updatedItem = await updateShoppingListItem(
        editingItem.list_item_id,
        {
          name: editName.trim(),
          quantity: editQuantity ? Number(editQuantity) : null,
          unit: editUnit.trim() || null,
        },
        token
      );

      setItems(currentItems =>
        currentItems.map(item =>
          item.list_item_id === updatedItem.list_item_id ? updatedItem : item
        )
      );

      setEditModalVisible(false);
      setEditingItem(null);
      setEditName('');
      setEditQuantity('');
      setEditUnit('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update item');
    }
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteShoppingListItem(itemId, token);
              setItems(currentItems => 
                currentItems.filter(item => item.list_item_id !== itemId)
              );
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  

  const renderLeftActions = (progress, dragX, item) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
  
    return (
      <View style={styles.leftAction}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => handleEdit(item)}
        >
          <Animated.View style={[{ transform: [{ scale }] }]}>
            <Ionicons name="pencil" size={24} color="white" />
            <Text style={styles.actionText}>Edit</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRightActions = (progress, dragX, item) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
  
    return (
      <View style={styles.rightAction}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.list_item_id)}
        >
          <Animated.View style={[{ transform: [{ scale }] }]}>
            <Ionicons name="trash" size={24} color="white" />
            <Text style={styles.actionText}>Delete</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderLeftActions={(progress, dragX) => 
        renderLeftActions(progress, dragX, item)
      }
      renderRightActions={(progress, dragX) => 
        renderRightActions(progress, dragX, item)
      }
    >
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemName}>{item.name}</Text>
          {(item.quantity || item.unit) && (
            <Text style={styles.itemDetails}>
              {item.quantity && `${item.quantity} `}
              {item.unit}
            </Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.checkButton}
          onPress={() => handleBought(item)}
        >
          <Ionicons 
            name={item.bought ? "checkmark-circle" : "ellipse-outline"} 
            size={24} 
            color={item.bought ? "#4CAF50" : "#666"}
          />
      </TouchableOpacity>
      </View>
    </Swipeable>
  );


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setAddItemsModalVisible(true)}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4141" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchItems}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  //handleBought
  // const handleBought = async (item) => {
  //   try {
  //     const hasDetails = item.quantity && item.unit;
      
  //     if (hasDetails) {
  //       Alert.prompt(
  //         'Add Price and Expiry',
  //         'Please enter the following details:',
  //         [
  //           {
  //             text: 'Cancel',
  //             style: 'cancel',
  //           },
  //           {
  //             text: 'Save',
  //             onPress: async (price, expiryDate, category) => {
  //               try {
  //                 // Use the service instead of direct fetch
  //                 await createGroceryItemFromShoppingItem({
  //                   name: item.name,
  //                   unit: item.unit,
  //                   purchased_quantity: item.quantity,
  //                   price: parseFloat(price),
  //                   expiry_date: expiryDate,
  //                   purchased_date: new Date().toISOString().split('T')[0],
  //                   category: category,
  //                 }, token);
  
  //                 await updateShoppingListItem(
  //                   item.list_item_id,
  //                   { ...item, bought: true },
  //                   token
  //                 );
  
  //                 fetchItems();
  //               } catch (error) {
  //                 Alert.alert('Error', error.message);
  //               }
  //             },
  //           },
  //         ],
  //         'plain-text'
  //       );
  //     } else {
  //       setSelectedBoughtItem(item);
  //       setFullDetailsModalVisible(true);
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', error.message);
  //   }
  // };

    //handleBought
    const handleBought = async (item) => {
      try {
        // Whether the item has pre-existing unit and quantity
        const hasDetails = item.quantity && item.unit;
        
        // In both cases, we'll use the FullDetailsModal but pre-populate fields if details exist
        setSelectedBoughtItem({
          ...item,
          // If hasDetails is true, pre-populate the fields
          prePopulatedFields: hasDetails ? {
            unit: item.unit,
            quantity: item.quantity.toString(),
          } : null
        });
        setFullDetailsModalVisible(true);
        
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };

    const handleFullDetailsSubmit = async (details) => {
      try {
        // Create grocery item with all details
        await createGroceryItemFromShoppingItem({
          name: selectedBoughtItem.name,
          // If we have pre-populated fields, use those values, otherwise use the entered values
          unit: selectedBoughtItem.prePopulatedFields?.unit || details.unit,
          purchased_quantity: parseFloat(selectedBoughtItem.prePopulatedFields?.quantity || details.quantity),
          price: parseFloat(details.price),
          expiry_date: details.expiryDate,
          purchased_date: details.purchasedDate || new Date().toISOString().split('T')[0],
          category: details.category,
        }, token);
    
        // Update the shopping list item to mark it as bought
        await updateShoppingListItem(
          selectedBoughtItem.list_item_id,
          { ...selectedBoughtItem, bought: true },
          token
        );
    
        // Close modal and refresh
        setFullDetailsModalVisible(false);
        setSelectedBoughtItem(null);
        fetchItems();
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to update item');
      }
    };

  return (
    <View style={styles.container}>
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={(item) => item.list_item_id?.toString() || Math.random().toString()}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>No items in this list</Text>
      }
    />
    <AddItemsModal
      visible={addItemsModalVisible}
      onClose={() => setAddItemsModalVisible(false)}
      shopping_list_id={listId}
      onSuccess={() => {
        fetchItems(); // This will refresh the items list
        setAddItemsModalVisible(false); // Close the modal
      }}
    />
    <Modal
  visible={editModalVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setEditModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Item</Text>
      <TextInput
        style={styles.modalInput}
        value={editName}
        onChangeText={setEditName}
        placeholder="Item name"
      />
      <TextInput
        style={styles.modalInput}
        value={editQuantity}
        onChangeText={setEditQuantity}
        placeholder="Quantity"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.modalInput}
        value={editUnit}
        onChangeText={setEditUnit}
        placeholder="Unit (optional)"
      />
      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={[styles.modalButton, styles.cancelButton]}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modalButton, styles.saveButton]}
          onPress={handleUpdate}
        >
          <Text style={styles.modalButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
<FullDetailsModal
  visible={fullDetailsModalVisible}
  onClose={() => {
    setFullDetailsModalVisible(false);
    setSelectedBoughtItem(null);
  }}
  onSubmit={handleFullDetailsSubmit}
  itemName={selectedBoughtItem?.name || ''}
  prePopulatedFields={selectedBoughtItem?.prePopulatedFields}
/>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  error: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  retryButton: {
    padding: 8,
  },
  retryText: {
    color: '#FF4141',
    fontSize: 16,
  },
  leftAction: {
    width: 80,
    height: '92%',
    marginBottom: 12,
    justifyContent: 'center',
  },
  rightAction: {
    width: 80,
    height: '92%',
    marginBottom: 12,
    justifyContent: 'center',
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF4141',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#FF4141',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShoppingListItemsPage;