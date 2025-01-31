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

        // Extract unique item IDs from grocery_item field
        const uniqueItemIds = [
          ...new Set(wastageRecords.map((item) => item.i)),
        ];

        // Fetch item details for each unique item_id
        const details = {};
        for (const itemId of uniqueItemIds) {
            console.log("ID "+ itemId)
          const itemDetail = await fetchItemById(itemId, token);
          details[itemId] = itemDetail;
    
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
    const detail = itemDetails[item.grocery_item]; // Get item details
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.itemName}>{detail?.name || "Loading..."}</Text>
        <Text style={styles.itemDetails}>Wasted On: {item.date}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wastage Records</Text>
      <FlatList
        data={wastageItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
