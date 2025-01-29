import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { UserContext } from "../../contexts/UserContext"; // ✅ Import UserContext
import { getWastageItems } from "../../services/wastageApi";

const WastagePage = () => { // Updated function name
  const { token } = useContext(UserContext);
  const [wastageItems, setWastageItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchWastageData();
    }
  }, [token]);

  const fetchWastageData = async () => {
    try {
      const items = await getWastageItems(token);
      setWastageItems(items);
    } catch (error) {
      console.error(" Failed to load wastage items:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <Text style={styles.error}> You must be logged in to view wastage records.</Text>;
  }

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wastage Records</Text>
      {wastageItems.length === 0 ? (
        <Text style={styles.noData}>No wastage records found.</Text>
      ) : (
        <FlatList
          data={wastageItems}
          keyExtractor={(item) => item.wastage_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemName}>Item ID: {item.grocery_item_id}</Text>
              <Text>Reason: {item.reason_for_waste}</Text>
              <Text>Quantity: {item.wasted_quantity}</Text>
              <Text>User ID: {item.user_id}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  noData: { fontSize: 16, color: "gray", textAlign: "center", marginTop: 20 },
  error: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
  card: { padding: 15, backgroundColor: "#f8f8f8", borderRadius: 10, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: "bold" },
});

export default WastagePage; //  Updated function name
