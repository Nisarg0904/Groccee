import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, updateUserDetails } from "../../services/userApi";
import { UserContext } from "../../contexts/UserContext";
import styles from "../../styles/EditProfilePageStyles";

const dietOptions = ["none", "vegan", "vegetarian", "pescatarian", "keto"];
const cuisineOptions = [
  "none",
  "indian",
  "korean",
  "chinese",
  "italian",
  "mexican",
];
const shoppingOptions = ["daily", "weekly", "biweekly", "monthly"];
const cookingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ProfilePictureSection = ({ profileImage, onPress }) => (
  <View style={{ alignItems: "center", marginBottom: 20 }}>
    <View style={styles.profilePictureContainer}>
      <Image
        source={
          profileImage
            ? { uri: profileImage }
            : require("../../../assets/profile.png")
        }
        style={styles.profilePicture}
      />
    </View>
    <TouchableOpacity onPress={onPress} style={styles.editPhotoButton}>
      <Ionicons name="camera" size={20} color="#E52B50" />
      <Text style={styles.editPhotoText}>Edit Photo</Text>
    </TouchableOpacity>
  </View>
);

const EditProfilePage = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { token } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [shoppingActivity, setShoppingActivity] = useState("daily");
  const [dietPreference, setDietPreference] = useState("none");
  const [cookingForPeople, setCookingForPeople] = useState(1);
  const [cuisinePreference, setCuisinePreference] = useState("none");
  const [customCuisine, setCustomCuisine] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile(token);

        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setShoppingActivity(userData.shoppingActivity || "daily");
        setDietPreference(userData.dietPreference || "none");
        setCookingForPeople(userData.cookingForPeople || 1);
        setCuisinePreference(userData.cuisinePreference || "none");
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch user profile",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // ✅ Handle profile picture update
  const handleProfilePictureUpdate = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Permission to access photo library is required!",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      Toast.show({
        type: "success",
        text1: "Profile Picture Updated",
        text2: "Your profile picture has been updated!",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        firstName,
        lastName,
        shoppingActivity,
        dietPreference,
        cookingForPeople,
        cuisinePreference:
          cuisinePreference === "none" ? customCuisine : cuisinePreference,
      };

      await updateUserDetails(token, updatedData);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully!",
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          "An error occurred while updating your profile. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#E52B50" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
        <LinearGradient colors={["#4A235A", "#1B264F"]} style={styles.header}>
          <Text style={styles.headerText}>Edit Profile</Text>
          <ProfilePictureSection
            profileImage={profileImage}
            onPress={handleProfilePictureUpdate}
          />
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Shopping Activity</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={shoppingActivity}
              onValueChange={setShoppingActivity}
            >
              {shoppingOptions.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>Diet Preference</Text>
          <View style={styles.checkboxContainer}>
            {dietOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setDietPreference(option)}
              >
                <Text
                  style={
                    dietPreference === option
                      ? styles.activeCheckbox
                      : styles.checkbox
                  }
                >
                  {dietPreference === option ? `✔ ${option}` : option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Cuisine Preference</Text>
          <View style={styles.checkboxContainer}>
            {cuisineOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setCuisinePreference(option)}
              >
                <Text
                  style={
                    cuisinePreference === option
                      ? styles.activeCheckbox
                      : styles.checkbox
                  }
                >
                  {cuisinePreference === option ? `✔ ${option}` : option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {cuisinePreference === "none" && (
            <TextInput
              style={styles.input}
              value={customCuisine}
              onChangeText={setCustomCuisine}
              placeholder="Enter custom cuisine"
            />
          )}

          <Text style={styles.sectionTitle}>Cooking for How Many People?</Text>
          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={cookingForPeople}
              onValueChange={setCookingForPeople}
            >
              {cookingOptions.map((option) => (
                <Picker.Item
                  key={option}
                  label={`${option} People`}
                  value={option}
                />
              ))}
            </Picker>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Ionicons name="checkmark-done" size={24} color="white" />
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>

      <Toast />
    </SafeAreaView>
  );
};

export default EditProfilePage;
