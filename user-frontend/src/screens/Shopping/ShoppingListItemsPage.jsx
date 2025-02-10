import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { fetchShoppingListItems } from "../../services/shoppingItemApi"; // Import shopping item API
import { fetchItemById } from "../../services/itemApi"; // Import item API

const ShoppingListItemsPage = ({ route }) => {
  const { shoppingListId } = route.params; // Get shopping list ID from route params
  const { token } = useContext(UserContext); // Get token from UserContext
  const [items, setItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch items in the shopping list
        const shoppingListItems = await fetchShoppingListItems(
          shoppingListId,
          token
        );

        // Fetch item details for each unique item_id
        const uniqueItemIds = [
          ...new Set(shoppingListItems.map((item) => item.item_id)),
        ];
        const details = {};
        for (const itemId of uniqueItemIds) {
          const itemDetail = await fetchItemById(itemId, token);
          details[itemId] = itemDetail;
        }

        setItems(shoppingListItems);
        setItemDetails(details);
      } catch (error) {
        console.error("Error fetching shopping list items:", error.message);
      }
    };

    fetchItems();
  }, [shoppingListId, token]);

  const renderItem = ({ item }) => {
    const detail = itemDetails[item.item_id];
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{detail?.name || "Loading..."}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemDetails}>Price: ${item.actual_price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List Items</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.list_item_id.toString()}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  list: {
    marginTop: 10,
  },
  itemContainer: {
    backgroundColor: "#333333",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  itemDetails: {
    fontSize: 14,
    color: "#BBBBBB",
    marginTop: 5,
  },
});

export default ShoppingListItemsPage;