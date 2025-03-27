import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import {
  getAllShoppingLists,
  updateShoppingList,
  deleteShoppingList,
} from "../../services/shoppingApi";
import {
  generateShoppingList, // Import the new function
} from "../../services/shoppingItemApi";
import CreateShoppingListModal from "../Shopping/CreateShoppingListPage";
import AddItemsModal from "./AddShoppingListItemPage";
import { format, formatInTimeZone } from "date-fns-tz";
import { parseISO } from "date-fns";
import { StatusBar } from "react-native";
import styles from "../../styles/ShoppingListsStyles";

const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const formatted = formatInTimeZone(
      parseISO(dateString),
      "America/Toronto",
      "MMM d, yyyy h:mm a"
    );
    return formatted;
  } catch (error) {
    console.error("Date formatting error:", error);
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
  const [editName, setEditName] = useState("");

  const fetchLists = async () => {
    if (!token) {
      console.log("No token available");
      setError("Authentication required");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching with token:", token);
      const data = await getAllShoppingLists(token);
      setShoppingLists(data);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      if (err.message === "Invalid Token") {
        setToken(null);
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch shopping lists");
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
      Alert.alert("Error", "List name cannot be empty");
      return;
    }

    try {
      const updatedList = await updateShoppingList(
        editingList.shopping_list_id,
        { name: editName.trim() },
        token
      );

      setShoppingLists((lists) =>
        lists.map((list) =>
          list.shopping_list_id === updatedList.shopping_list_id
            ? updatedList
            : list
        )
      );

      setEditModalVisible(false);
      setEditingList(null);
      setEditName("");
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update list");
    }
  };

  const handleDelete = (listId) => {
    Alert.alert("Delete List", "Are you sure you want to delete this list?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteShoppingList(listId, token);
            setShoppingLists((lists) =>
              lists.filter((list) => list.shopping_list_id !== listId)
            );
          } catch (error) {
            Alert.alert("Error", error.message || "Failed to delete list");
          }
        },
      },
    ]);
  };

  // New function to handle generating a shopping list
  const handleGenerateList = async () => {
    try {
      const data = await generateShoppingList(token);
      console.log("Generated list:", data);
      // Refresh the lists to show the new one
      fetchLists();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to generate shopping list");
    }
  };

  const renderLeftActions = (progress, dragX, item) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
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
      extrapolate: "clamp",
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
        style={[
          styles.listItem,
          item.status === "Purchased" && styles.purchasedItem,
        ]}
        onPress={() =>
          navigation.navigate("ShoppingListItems", {
            listId: item.shopping_list_id,
          })
        }
      >
        <View style={styles.listItemContent}>
          <Text style={styles.listName}>{item.name}</Text>
          <Text
            style={[
              styles.listStatus,
              item.status === "Purchased" && styles.purchasedStatus,
            ]}
          >
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

  return (
    <View style={styles.container}>
      {/* New "Generate List" button on the left side */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={handleGenerateList}
      >
        <Text style={styles.generateButtonText}>Generate List</Text>
      </TouchableOpacity>

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

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      <CreateShoppingListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSuccess={(newList) => {
          setModalVisible(false);
          setCurrentShoppingListId(newList.shopping_list_id);
          setAddItemsModalVisible(true);
          fetchLists();
        }}
      />

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
          fetchLists();
        }}
      />

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

export default ShoppingListsPage;
