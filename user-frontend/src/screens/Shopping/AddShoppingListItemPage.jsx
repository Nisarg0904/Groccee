// components/ShoppingList/AddItemsModal.jsx
import React, { useState, useContext, useEffect } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import {
  createMultipleShoppingListItems,
  fetchSuggestedItems,
} from "../../services/shoppingItemApi";
import {
  fetchSuggestedUnits

} from "../../services/groceryApi";
import styles from "../../styles/AddShoppingListItemStyles";
import debounce from "lodash/debounce";

const AddItemsModal = ({ visible, onClose, shopping_list_id, onSuccess }) => {
  const { token } = useContext(UserContext);
  const [itemName, setItemName] = useState("");
  const [items, setItems] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestedUnits, setSuggestedUnits] = useState([]);
  

  const [currentItem, setCurrentItem] = useState({
    name: "",
    unit: "",
    quantity: "",
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
      console.error("Search error:", error);
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
      unit: suggestion.preferred_unit || "",
      quantity: "",
      availableUnits: suggestion.units || [],
    });
    setItemName("");
    setSuggestions([]);
    setShowSuggestions(false);
    setDetailsModalVisible(true);
  };

  const handleItemSubmit = () => {
    if (!itemName.trim()) return;

    setCurrentItem({
      name: itemName.trim(),
      unit: "",
      quantity: "",
      availableUnits: [],
    });
    setItemName("");
    setDetailsModalVisible(true);
  };

  const handleDetailsSubmit = (withDetails = true) => {
    if (withDetails) {
      if (currentItem.quantity && isNaN(currentItem.quantity)) {
        Alert.alert("Error", "Quantity must be a number");
        return;
      }
    }

    setItems([
      ...items,
      {
        name: currentItem.name,
        unit: withDetails ? currentItem.unit : "",
        quantity: withDetails ? currentItem.quantity : "",
      },
    ]);
    setDetailsModalVisible(false);
    setCurrentItem({ name: "", unit: "", quantity: "", availableUnits: [] });
  };

  const saveAllItems = async () => {
    if (!shopping_list_id) {
      console.error("No shopping list ID provided");
      Alert.alert("Error", "Invalid shopping list");
      return;
    }

    setSaving(true);
    try {
      await createMultipleShoppingListItems(items, shopping_list_id, token);
      setItems([]); // Clear the items
      onSuccess?.(); // Call onSuccess if it exists
      onClose?.(); // Close the modal after successful save
    } catch (error) {
      console.error("Error saving items:", error);
      Alert.alert("Error", error.message || "Failed to save items");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (items.length > 0) {
      Alert.alert(
        "Unsaved Changes",
        "Do you want to save your items before leaving?",
        [
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setItems([]);
              onClose?.(); // Use optional chaining
            },
          },
          {
            text: "Save",
            onPress: saveAllItems,
          },
          {
            text: "Cancel",
            style: "cancel",
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
          const newItems = items.filter((i) => i.name !== item.name);
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
                      <Text style={styles.suggestionCategory}>
                        {item.category}
                      </Text>
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
            <TouchableWithoutFeedback
              onPress={() => setDetailsModalVisible(false)}
            >
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
                                currentItem.unit === item &&
                                  styles.selectedUnit,
                              ]}
                              onPress={() =>
                                setCurrentItem({ ...currentItem, unit: item })
                              }
                            >
                              <Text
                                style={[
                                  styles.unitText,
                                  currentItem.unit === item &&
                                    styles.selectedUnitText,
                                ]}
                              >
                                {item}
                              </Text>
                            </TouchableOpacity>
                          )}
                          keyExtractor={(item) => item}
                        />
                      </View>
                    ) : (
                      <View>
                        {/* Manual Unit Input */}
                        <TextInput
                          style={styles.detailsModalInput}
                          placeholder="Enter Unit (e.g., kg, pieces)"
                          value={currentItem.unit}
                          onChangeText={(text) => {
                            setCurrentItem({ ...currentItem, unit: text });

                            // Fetch unit suggestions dynamically when typing
                            if (text.length > 1) {
                              fetchSuggestedUnits(text)
                                .then((units) => setSuggestedUnits(units))
                                .catch(() => setSuggestedUnits([]));
                            } else {
                              setSuggestedUnits([]);
                            }
                          }}
                        />

                        {/* Show Suggested Units */}
                        {suggestedUnits.length > 0 && (
                          <FlatList
                            data={suggestedUnits}
                            keyExtractor={(unit) => unit}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                onPress={() => {
                                  setCurrentItem({
                                    ...currentItem,
                                    unit: item,
                                  });
                                  setSuggestedUnits([]); // Hide suggestions
                                }}
                                style={styles.suggestionItemContainer}
                              >
                                <Text style={styles.suggestionItem}>
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        )}
                      </View>
                    )}

                    <TextInput
                      style={styles.detailsModalInput}
                      placeholder="Quantity"
                      value={currentItem.quantity}
                      onChangeText={(text) =>
                        setCurrentItem({ ...currentItem, quantity: text })
                      }
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

export default AddItemsModal;
