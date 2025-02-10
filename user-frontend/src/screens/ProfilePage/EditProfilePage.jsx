import React, { useState } from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import styles from "../../styles/EditProfilePageStyles";

// Reusable component for the profile picture section
const ProfilePictureSection = ({ profileImage, onPress }) => (
  <View style={{ alignItems: "center" }}>
    <View style={styles.profilePictureContainer}>
      <Image
        source={profileImage ? { uri: profileImage } : require("../../../assets/profile.png")}
        style={styles.profilePicture}
      />
    </View>
    <TouchableOpacity 
      onPress={onPress} 
      style={{ marginTop: 8, flexDirection: "row", alignItems: "center" }}
    >
      <Ionicons name="camera" size={20} color="#E52B50" />
      <Text style={{ marginLeft: 4, color: "#E52B50", fontSize: 14 }}>Edit Photo</Text>
    </TouchableOpacity>
  </View>
);

const EditProfilePage = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("user");
  const [email, setEmail] = useState("user@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("+14987899999");
  const [password, setPassword] = useState("Password#");
  const [preferences, setPreferences] = useState("Vegan");

  // Called when the user taps the profile picture camera icon.
  const handleProfilePictureUpdate = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    // Placeholder for update logic. Will connect to the database later.
    try {
      const response = await fetch('https://your-api-endpoint.com/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          phoneNumber,
          password,
          preferences,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile!");

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
        text2: "An error occurred while updating your profile. Please try again.",
      });
    }
  };

  const togglePreference = (preference) => {
    setPreferences(preference);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Gradient Header */}
        <LinearGradient 
          colors={['#4A235A', '#1B264F']} 
          style={styles.header}
          start={[0, 0]} 
          end={[1, 1]}
        >
          <Text style={styles.headerText}>Edit Profile</Text>
          {/* Use the reusable ProfilePictureSection component */}
          <ProfilePictureSection 
            profileImage={profileImage}
            onPress={handleProfilePictureUpdate} 
          />
        </LinearGradient>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: "80%" }]} />
          </View>
          <Text style={styles.progressText}>Profile 80% Complete</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Personal Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#D3D3D3"
              />
            </View>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#D3D3D3"
                keyboardType="email-address"
              />
            </View>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Phone Number"
                placeholderTextColor="#D3D3D3"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputCard}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#D3D3D3"
                secureTextEntry
              />
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.chipsContainer}>
              {["Vegan", "Vegetarian", "Non-Vegetarian", "Keto", "Paleo"].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.chip,
                    preferences === item ? styles.activeChip : null,
                  ]}
                  onPress={() => togglePreference(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      preferences === item ? styles.activeChipText : null,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Update Button */}
      <TouchableOpacity 
        style={[
          styles.updateButton, 
          { marginBottom: insets.bottom + 25 }
        ]}
        onPress={handleUpdate}
      >
        <Ionicons name="checkmark-done" size={24} color="white" />
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
      
      {/* Toast Message Container */}
      <Toast />
    </SafeAreaView>
  );
};

export default EditProfilePage;
