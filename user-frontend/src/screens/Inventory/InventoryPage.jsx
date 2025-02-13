import React, { useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  SectionList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { fetchGroceries, deleteGroceryItem } from "../../services/groceryApi";
import { UserContext } from "../../contexts/UserContext";
import styles from "../../styles/ViewGroceriesPageStyles";

const InventoryPage = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [groceries, setGroceries] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");

  const loadGroceries = async () => {
    try {
      const data = await fetchGroceries(token);
      console.log("Fetched groceries:", data);
      setGroceries(data);
    } catch (error) {
      console.error("Error fetching groceries:", error);
      Alert.alert(
        "Error",
        "Failed to load groceries. Check your network or backend."
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGroceries();
    }, [token])
  );

  const filteredGroceries = groceries.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const groupGroceries = () => {
    const expiringSoon = [];
    const expiringInSomeTime = [];
    const hasTime = [];
    const now = new Date();

    filteredGroceries.forEach((item) => {
      if (item.expiry_date) {
        const expiryDate = new Date(item.expiry_date);
        const diffTime = expiryDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 2) {
          expiringSoon.push({ ...item, diffDays });
        } else if (diffDays >= 3 && diffDays <= 7) {
          expiringInSomeTime.push({ ...item, diffDays });
        } else {
          hasTime.push({ ...item, diffDays });
        }
      } else {
        hasTime.push({ ...item, diffDays: "N/A" });
      }
    });

    const sections = [];
    if (expiringSoon.length) {
      sections.push({ title: "Expiring Soon", data: expiringSoon });
    }
    if (expiringInSomeTime.length) {
      sections.push({
        title: "Expiring In Some Time",
        data: expiringInSomeTime,
      });
    }
    if (hasTime.length) {
      sections.push({ title: "Has Time", data: hasTime });
    }
    return sections;
  };

  const sections = groupGroceries();

  const renderSectionHeader = ({ section: { title } }) => (
    <Text
      style={[
        styles.sectionHeader,
        {
          backgroundColor: "#f4f4f4",
          padding: 8,
          fontSize: 18,
          fontWeight: "bold",
        },
      ]}
    >
      {title}
    </Text>
  );

  const handleDelete = (id) => {
    if (!id) {
      Alert.alert("Error", "Invalid item ID.");
      return;
    }

    console.log("Attempting to delete item with ID:", id);

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this grocery item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteGroceryItem(token, id);
              loadGroceries();
            } catch (error) {
              console.error("Error deleting item:", error);
              Alert.alert("Error", "Unable to delete item");
            }
          },
        },
      ]
    );
  };

  const renderRightActions = (item) => {
    console.log("Item in renderRightActions:", item); // Debugging
    const itemId = item._id || item.id;

    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.editButton,
            { paddingHorizontal: 15, justifyContent: "center" },
          ]}
          onPress={() => navigation.navigate("EditGroceryPage", { item })}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
            { paddingHorizontal: 15, justifyContent: "center" },
          ]}
          onPress={() => handleDelete(itemId)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    console.log("Rendering item:", item); // Debugging

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetail}>
            Expiry: {item.expiry_date ? item.expiry_date : "N/A"}{" "}
            {item.diffDays !== "N/A" && `(in ${item.diffDays} days)`}
          </Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <TextInput
        style={[styles.input, { marginBottom: 16 }]}
        placeholder="Filter by name..."
        placeholderTextColor="#666"
        value={filterQuery}
        onChangeText={setFilterQuery}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No groceries found.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

export default InventoryPage;
