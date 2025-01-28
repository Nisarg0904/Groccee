import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import styles from "../../styles/EditProfilePageStyles";

const EditProfilePage = ({ navigation }) => {
  const [username, setUsername] = useState("user");
  const [email, setEmail] = useState("user@gmail.com");
  const [phoneNumber, setPhoneNumber] = useState("+14987899999");
  const [password, setPassword] = useState("Password#");
  const [preferences, setPreferences] = useState("Vegan"); // Single preference now

  const handleUpdate = async () => {
    // Placeholder for dynamic update logic
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

      alert("Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      alert("An error occurred while updating the profile. Please try again.");
    }
  };

  const togglePreference = (preference) => {
    setPreferences(preference); // Allow only one preference at a time
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Edit Profile</Text>
        <View style={styles.profilePictureContainer}>
          <Image
            source={require("../../../assets/profile.png")}
            style={styles.profilePicture}
          />
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: "80%" }]} />
        </View>
        <Text style={styles.progressText}>Profile 80% Complete</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
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
      </ScrollView>

      {/* Sticky Update Button */}
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Ionicons name="checkmark-done" size={24} color="white" />
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfilePage;
