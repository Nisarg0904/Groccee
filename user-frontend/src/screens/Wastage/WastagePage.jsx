import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { UserContext } from "../../contexts/UserContext";
import { getWastageItems } from "../../services/wastageApi"; // Import wastage API
import { fetchItemById } from "../../services/itemApi"; // Import item API

const WastageItemsPage = () => {
  const { token } = useContext(UserContext); // Get token from UserContext
  const [wastageItems, setWastageItems] = useState([]);
  const [itemDetails, setItemDetails] = useState({});

  useEffect(() => {
    const fetchWastageData = async () => {
      try {
        // Fetch wastage records
        const wastageRecords = await getWastageItems(token);

        // Extract unique item IDs
        const uniqueItemIds = [
          ...new Set(wastageRecords.map((item) => item.item_id)),
        ];

        // Fetch item details for each item_id
        const details = {};
        for (const itemId of uniqueItemIds) {
          try {
            const itemDetail = await fetchItemById(itemId, token);
            details[itemId] = itemDetail;
          } catch (err) {
            console.error(
              `Error fetching details for item ${itemId}:`,
              err.message
            );
          }
        }

        setWastageItems(wastageRecords);
        setItemDetails(details);
      } catch (error) {
        console.error("Error fetching wastage items:", error.message);
      }
    };

    fetchWastageData();
  }, [token]);

  const renderItem = ({ item }) => {
    const detail = itemDetails[item.item_id]; // Get item details
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{detail?.name || "Loading..."}</Text>
        <Text style={styles.itemDetails}>
          Wasted Quantity: {item.wasted_quantity}
        </Text>
        <Text style={styles.itemDetails}>Reason: {item.reason_for_waste}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wastage Records</Text>
      <FlatList
        data={wastageItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.wastage_id.toString()}
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

export default WastageItemsPage;
