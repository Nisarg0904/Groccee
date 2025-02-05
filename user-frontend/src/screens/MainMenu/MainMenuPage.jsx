import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserContext } from "../../contexts/UserContext";
import styles from "../../styles/MainMenuPageStyles";

const MainMenuPage = ({ navigation }) => {
  const { setCurrentUser } = useContext(UserContext);

  const handleLogout = () => {
    setCurrentUser(null);
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main Menu</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ProfileSetup")}
      >
        <Text style={styles.buttonText}>Manage Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddGrocery")}
      >
        <Text style={styles.buttonText}>Add Grocery</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ViewGroceries")}
      >
        <Text style={styles.buttonText}>View Groceries</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ShoppingList")}
      >
        <Text style={styles.buttonText}>Shopping List</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Wastage")}
      >
        <Text style={styles.buttonText}>Wastage</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainMenuPage;
