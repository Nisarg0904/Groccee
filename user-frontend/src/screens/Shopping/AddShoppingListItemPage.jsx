// components/ShoppingList/AddItemsModal.jsx
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../contexts/UserContext';
import { createMultipleShoppingListItems, fetchSuggestedItems } from '../../services/shoppingItemApi';
import debounce from 'lodash/debounce';

const AddItemsModal = ({ visible, onClose, shopping_list_id, onSuccess }) => {
  const { token } = useContext(UserContext);
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    name: '',
    unit: '',
    quantity: '',
    availableUnits: [],
  });

  // Debounced search function
  const debouncedSearch = debounce(async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const results = await fetchSuggestedItems(searchTerm);
      setSuggestions(Array.isArray(results) ? results : []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    if (itemName) {
      debouncedSearch(itemName);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => debouncedSearch.cancel();
  }, [itemName]);

  const handleSuggestionSelect = (suggestion) => {
    setCurrentItem({
      name: suggestion.name,
      unit: suggestion.preferred_unit || '',
      quantity: '',
      availableUnits: suggestion.units || [],
    });
    setItemName('');
    setSuggestions([]);
    setShowSuggestions(false);
    setDetailsModalVisible(true);
  };

  const handleItemSubmit = () => {
    if (!itemName.trim()) return;

    setCurrentItem({
      name: itemName.trim(),
      unit: '',
      quantity: '',
      availableUnits: [],
    });
    setItemName('');
    setDetailsModalVisible(true);
  };

  const handleDetailsSubmit = (withDetails = true) => {
    if (withDetails) {
      if (currentItem.quantity && isNaN(currentItem.quantity)) {
        Alert.alert('Error', 'Quantity must be a number');
        return;
      }
    }
  
    setItems([...items, {
      name: currentItem.name,
      unit: withDetails ? currentItem.unit : '',
      quantity: withDetails ? currentItem.quantity : '',
    }]);
    setDetailsModalVisible(false);
    setCurrentItem({ name: '', unit: '', quantity: '', availableUnits: [] });
  };
  
  const saveAllItems = async () => {
    if (!shopping_list_id) {
      console.error('No shopping list ID provided');
      Alert.alert('Error', 'Invalid shopping list');
      return;
    }
  
    setSaving(true);
    try {
      await createMultipleShoppingListItems(items, shopping_list_id, token);
      setItems([]); // Clear the items
      onSuccess?.(); // Call onSuccess if it exists
      onClose?.(); // Close the modal after successful save
    } catch (error) {
      console.error('Error saving items:', error);
      Alert.alert('Error', error.message || 'Failed to save items');
    } finally {
      setSaving(false);
    }
  };


  const handleClose = () => {
    if (items.length > 0) {
      Alert.alert(
        'Unsaved Changes',
        'Do you want to save your items before leaving?',
        [
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setItems([]);
              onClose?.(); // Use optional chaining
            },
          },
          {
            text: 'Save',
            onPress: saveAllItems,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      onClose?.(); // Use optional chaining
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.quantity} {item.unit}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => {
          const newItems = items.filter(i => i.name !== item.name);
          setItems(newItems);
        }}
        disabled={saving}
      >
        <Ionicons name="trash-outline" size={24} color="#FF4141" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={handleClose}
  >
    {/* Your existing JSX structure remains the same */}
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Items</Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            value={itemName}
            onChangeText={setItemName}
            onSubmitEditing={() => {
              if (itemName.trim()) {
                handleItemSubmit();
              }
            }}
            returnKeyType="next"
            editable={!saving}
          />
          <TouchableOpacity
            style={[styles.addButton, saving && styles.disabledButton]}
            onPress={() => {
              if (itemName.trim()) {
                handleItemSubmit();
              }
            }}
            disabled={saving}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FF4141" />
          </View>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => `${item.name}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionSelect(item)}
                >
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  {item.category && (
                    <Text style={styles.suggestionCategory}>{item.category}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        )}

          {saving && (
            <View style={styles.savingOverlay}>
              <ActivityIndicator size="large" color="#FF4141" />
              <Text style={styles.savingText}>Saving items...</Text>
            </View>
          )}

          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No items added yet</Text>
            }
          />

          {items.length > 0 && (
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={saveAllItems}
              disabled={saving}
            >
              <Text style={styles.saveButtonText}>Save Items</Text>
            </TouchableOpacity>
          )}

          {/* Details Modal */}
          <Modal
            visible={detailsModalVisible}
            transparent={true}
            animationType="slide"
          >
            <TouchableWithoutFeedback onPress={() => setDetailsModalVisible(false)}>
              <View style={styles.detailsModalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.detailsModalContent}>
                    <Text style={styles.detailsModalTitle}>
                      Enter details for {currentItem.name}
                    </Text>
                    
                    {currentItem.availableUnits.length > 0 ? (
                      <View style={styles.unitSelector}>
                        <Text style={styles.label}>Select Unit:</Text>
                        <FlatList
                          data={currentItem.availableUnits}
                          horizontal
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={[
                                styles.unitOption,
                                currentItem.unit === item && styles.selectedUnit
                              ]}
                              onPress={() => setCurrentItem({...currentItem, unit: item})}
                            >
                              <Text style={[
                                styles.unitText,
                                currentItem.unit === item && styles.selectedUnitText
                              ]}>{item}</Text>
                            </TouchableOpacity>
                          )}
                          keyExtractor={(item) => item}
                        />
                      </View>
                    ) : (
                      <TextInput
                        style={styles.detailsModalInput}
                        placeholder="Unit (e.g., kg, pieces)"
                        value={currentItem.unit}
                        onChangeText={(text) => setCurrentItem({...currentItem, unit: text})}
                      />
                    )}
                    
                    <TextInput
                      style={styles.detailsModalInput}
                      placeholder="Quantity"
                      value={currentItem.quantity}
                      onChangeText={(text) => setCurrentItem({...currentItem, quantity: text})}
                      keyboardType="numeric"
                    />

                    <View style={styles.detailsModalButtons}>
                      <TouchableOpacity 
                        style={[styles.detailsModalButton, styles.skipButton]}
                        onPress={() => handleDetailsSubmit(false)}
                      >
                        <Text style={styles.buttonText}>Skip Details</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.detailsModalButton, styles.submitButton]}
                        onPress={() => handleDetailsSubmit(true)}
                      >
                        <Text style={styles.buttonText}>Add with Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FF4141',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#FF4141',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Details Modal Styles
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  detailsModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsModalInput: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
  },
  detailsModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  detailsModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  skipButton: {
    backgroundColor: '#888',
  },
  submitButton: {
    backgroundColor: '#FF4141',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  savingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  disabledButton: {
    opacity: 0.5,
  },
  suggestionsContainer: {
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
  },
  suggestionCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  unitSelector: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  unitOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedUnit: {
    backgroundColor: '#FF4141',
  },
  unitText: {
    color: '#666',
  },
  selectedUnitText: {
    color: '#fff',
  },
});

export default AddItemsModal;