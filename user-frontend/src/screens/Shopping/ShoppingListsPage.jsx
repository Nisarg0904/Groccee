import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../contexts/UserContext';
import { getAllShoppingLists, updateShoppingList, deleteShoppingList } from '../../services/shoppingApi';
import CreateShoppingListModal from '../Shopping/CreateShoppingListPage';
import AddItemsModal from './AddShoppingListItemPage';
import { format, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';
import { StatusBar } from 'react-native';

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Convert UTC to Toronto timezone and format
    const formatted = formatInTimeZone(
      parseISO(dateString),
      'America/Toronto',
      'MMM d, yyyy h:mm a'
    );
    return formatted;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};


const ShoppingListsPage = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemsModalVisible, setAddItemsModalVisible] = useState(false);
const [currentShoppingListId, setCurrentShoppingListId] = useState(null);
  const { token, setToken } = useContext(UserContext);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchLists = async () => {
    if (!token) {
      console.log('No token available');
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching with token:', token); // Debugging
      const data = await getAllShoppingLists(token);
      setShoppingLists(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message === 'Invalid Token') {
        // Handle invalid token
        setToken(null); // Clear invalid token
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to fetch shopping lists');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLists();
    }
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLists();
  };

  const handleEdit = (list) => {
    setEditingList(list);
    setEditName(list.name);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'List name cannot be empty');
      return;
    }

    try {
      const updatedList = await updateShoppingList(
        editingList.shopping_list_id,
        { name: editName.trim() },
        token
      );

      setShoppingLists(lists =>
        lists.map(list =>
          list.shopping_list_id === updatedList.shopping_list_id ? updatedList : list
        )
      );

      setEditModalVisible(false);
      setEditingList(null);
      setEditName('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update list');
    }
  };

  const handleDelete = (listId) => {
    Alert.alert(
      'Delete List',
      'Are you sure you want to delete this list?',
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
              await deleteShoppingList(listId, token);
              setShoppingLists(lists => 
                lists.filter(list => list.shopping_list_id !== listId)
              );
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete list');
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
          onPress={() => handleDelete(item.shopping_list_id)}
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
    <TouchableOpacity
      style={[styles.listItem, item.status === 'Purchased' && styles.purchasedItem]}
      onPress={() => navigation.navigate('ShoppingListItems', { listId: item.shopping_list_id })}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={[styles.listStatus, item.status === 'Purchased' && styles.purchasedStatus]}>
          {item.status}
        </Text>
        <Text style={styles.dateText}>
          Created: {formatDate(item.createdAt)}
        </Text>
        {item.purchased_date && (
          <Text style={styles.purchaseDate}>
            Purchased: {formatDate(item.purchased_date)}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  </Swipeable>
);


  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4141" />
      </View>
    );
  }


  const handleSuccess = (newList) => {
    // Navigate to AddShoppingListItems screen or update your list
    fetchLists();
    navigation.navigate('AddShoppingListItems', {
      shopping_list_id: newList.shopping_list_id,
      listName: newList.name
    });
  };
  


  return (
   
    <View style={styles.container}>
    {error ? (
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLists}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <FlatList
        data={shoppingLists}
        renderItem={renderItem}
        keyExtractor={(item) => item.shopping_list_id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No shopping lists found</Text>
        }
      />
    )}

    {/* Floating Action Button for creating new list */}
    <TouchableOpacity
      style={styles.fabButton}
      onPress={() => setModalVisible(true)}
    >
      <Ionicons name="add" size={24} color="#FFF" />
    </TouchableOpacity>

    {/* Create Shopping List Modal */}
    <CreateShoppingListModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  onSuccess={(newList) => {
    setModalVisible(false); // Close create list modal
    setCurrentShoppingListId(newList.shopping_list_id); // Store the new list ID
    setAddItemsModalVisible(true); // Show add items modal
    fetchLists(); // Refresh the lists in background
  }}
/>

{/* Add this AddItemsModal component */}
<AddItemsModal
  visible={addItemsModalVisible}
  onClose={() => {
    setAddItemsModalVisible(false);
    setCurrentShoppingListId(null);
  }}
  shopping_list_id={currentShoppingListId}
  onSuccess={() => {
    setAddItemsModalVisible(false);
    setCurrentShoppingListId(null);
    fetchLists(); // Refresh the lists
  }}
/>

    {/* Edit List Modal */}
    <Modal
      visible={editModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit List Name</Text>
          <TextInput
            style={styles.modalInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Enter new name"
            autoFocus
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
  </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight + 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4141',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  listItemContent: {
    flex: 1,
  },
  purchasedItem: {
    backgroundColor: '#f0f8f0',
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  listStatus: {
    fontSize: 14,
    color: '#666',
  },
  purchasedStatus: {
    color: '#4CAF50',
  },
  purchaseDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
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
    marginTop: 8,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    padding: 8,
  },
  retryText: {
    color: '#FF4141',
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  purchaseDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 4,
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
 rightAction: {
  width: 80,
  height: '92%',
  marginBottom: 12,
  justifyContent: 'center',
},
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftAction: {
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

  // Modify listItem style to remove default border radius on the right when swiped
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
fabButton: {
    position: 'absolute',
    right: 16,
    bottom: 80, // Increased to account for bottom tab bar
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4141',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
});

export default ShoppingListsPage;