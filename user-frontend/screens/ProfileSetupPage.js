import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  updateUserDetails,
  deleteUserAccount,
  getUserProfile,
} from "../services/userApi";
import { UserContext } from "../contexts/UserContext";
import styles from "../styles/ProfileSetupPageStyles";

const ProfileSetupPage = ({ navigation }) => {
  const { token, setCurrentUser } = useContext(UserContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [shoppingActivity, setShoppingActivity] = useState("daily");
  const [dietPreference, setDietPreference] = useState("none");
  const [cuisinePreference, setCuisinePreference] = useState("none");
  const [cookingForPeople, setCookingForPeople] = useState(1);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserProfile(token);

        // Safely set the values to prevent null/undefined issues
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setShoppingActivity(userData.shoppingActivity || "daily");
        setDietPreference(userData.dietPreference || "none");
        setCuisinePreference(userData.cuisinePreference || "none");
        setCookingForPeople(userData.cookingForPeople || 1);
        setCurrentUser(userData); // Store the user data in context
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user information");
      }
    };

    fetchUserData();
  }, [token]);

  // Handles updating the profile information
const handleProfileSetup = async () => {
  try {
    const updatedData = {
      firstName,
      lastName,
      shoppingActivity,
      dietPreference,
      cuisinePreference,
      cookingForPeople,
    };

    console.log("Updated Data:", updatedData); // Log data being sent
    const updatedUser = await updateUserDetails(token, updatedData);

    console.log("Updated User:", updatedUser); // Log the response

    setCurrentUser(updatedUser);

    Alert.alert("Success", "Profile setup completed!");
    navigation.navigate("MainMenu");
  } catch (error) {
    console.error("Error updating profile:", error); // Log the error
    Alert.alert("Profile Setup Failed", error.message || "An error occurred.");
  }
};


  // Handles account deletion
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAccount(token);
              setCurrentUser(null);
              Alert.alert("Account Deleted", "Your account has been deleted.");
              navigation.navigate("SignIn");
            } catch (error) {
              Alert.alert("Account Deletion Failed", error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Shopping Activity</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={shoppingActivity}
          style={styles.picker}
          onValueChange={(itemValue) => setShoppingActivity(itemValue)}
        >
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Weekly" value="weekly" />
          <Picker.Item label="Biweekly" value="biweekly" />
          <Picker.Item label="Monthly" value="monthly" />
        </Picker>
      </View>

      <Text style={styles.label}>Diet Preference</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={dietPreference}
          style={styles.picker}
          onValueChange={(itemValue) => setDietPreference(itemValue)}
        >
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Vegan" value="vegan" />
          <Picker.Item label="Vegetarian" value="vegetarian" />
          <Picker.Item label="Pescatarian" value="pescatarian" />
          <Picker.Item label="Keto" value="keto" />
        </Picker>
      </View>

      <Text style={styles.label}>Cuisine Preference</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={cuisinePreference}
          style={styles.picker}
          onValueChange={(itemValue) => setCuisinePreference(itemValue)}
        >
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Indian" value="indian" />
          <Picker.Item label="Korean" value="korean" />
          <Picker.Item label="Chinese" value="chinese" />
          <Picker.Item label="Italian" value="italian" />
          <Picker.Item label="Mexican" value="mexican" />
        </Picker>
      </View>

      <Text style={styles.label}>Cooking for How Many People?</Text>
      <TextInput
        style={styles.input}
        placeholder="Number of People"
        value={cookingForPeople.toString()}
        keyboardType="numeric"
        onChangeText={(text) => setCookingForPeople(Number(text))}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleProfileSetup}
        >
          <Text style={styles.buttonText}>Complete Setup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.updateButton]}
          onPress={() => setIsPasswordModalVisible(true)}
        >
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileSetupPage;