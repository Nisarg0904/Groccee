import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { UserContext } from "../../contexts/UserContext"; // Import UserContext
import { fetchShoppingListsByStatus } from "../../services/shoppingApi"; // Import the shopping API
import styles from "../../styles/ShoppingListPageStyles";

const ShoppingListsPage = ({ route, navigation }) => {
  const { status } = route.params; // Get the status from the route params
  const { token } = useContext(UserContext); // Get token from UserContext
  const [shoppingLists, setShoppingLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const lists = await fetchShoppingListsByStatus(status, token);
        const sortedLists = lists.sort((a, b) => {
          if (status === "bought") {
            return new Date(a.purchased_on) - new Date(b.purchased_on);
          } else {
            return new Date(a.created_on) - new Date(b.created_on);
          }
        });
        setShoppingLists(sortedLists);
      } catch (error) {
        console.error("Error fetching shopping lists:", error.message);
      }
    };

    fetchLists();
  }, [status, token]);

const renderShoppingList = ({ item }) => (
  <TouchableOpacity
    style={styles.listItem}
    onPress={() =>
      navigation.navigate("ShoppingListItems", { shoppingListId: item.list_id })
    }
  >
    <Text style={styles.listTitle}>{item.name}</Text>
    <Text style={styles.listDate}>
      Created On: {new Date(item.created_on).toLocaleDateString()}
    </Text>
    {status === "bought" && (
      <Text style={styles.listDate}>
        Purchased On: {new Date(item.purchased_on).toLocaleDateString()}
      </Text>
    )}
  </TouchableOpacity>
);



  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {status === "bought" ? "Bought Items" : "Unbought Items"}
      </Text>

      <FlatList
        data={shoppingLists}
        renderItem={renderShoppingList}
        keyExtractor={(item) => item.list_id.toString()}
        style={styles.listContainer}
      />
    </View>
  );
};

export default ShoppingListsPage;
