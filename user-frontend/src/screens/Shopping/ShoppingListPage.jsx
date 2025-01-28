import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../styles/ShoppingListPageStyles";

const ShoppingListPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ShoppingLists", { status: "not_bought" })
        }
      >
        <Text style={styles.buttonText}>Unbought Items</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("ShoppingLists", { status: "bought" })
        }
      >
        <Text style={styles.buttonText}>Bought Items</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShoppingListPage;
