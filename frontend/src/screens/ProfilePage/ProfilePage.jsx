import React, { useContext, useEffect, useState, useCallback } from "react";
import { 
  SafeAreaView, 
  ScrollView, 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  ActivityIndicator 
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import styles from "../../styles/ProfilePageStyles";
import { UserContext } from "../../contexts/UserContext";
import { getUserProfile } from "../../services/userApi";

const ProfilePage = ({ navigation }) => {
  const { currentUser, token, setCurrentUser, setToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileData = await getUserProfile(token);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use useFocusEffect to refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [token])
  );

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  // Calculate display name
  const displayName = userProfile ? 
    `${userProfile.firstName} ${userProfile.lastName}` : 
    "@username";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <ScrollView
        style={{ backgroundColor: "black" }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={require("../../../assets/profile.png")}
              style={styles.profileImage}
            />
            <Text style={styles.username}>{displayName}</Text>
            <Text style={styles.description}>
              {userProfile?.email || "No email provided"}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfilePage")}
            >
              <Text style={styles.editButtonText}>EDIT</Text>
            </TouchableOpacity>
          </View>

          {/* Preferences Section */}
          <View style={styles.preferencesSection}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.preferences}>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Shopping Activity:</Text>
                <Text style={styles.preferenceValue}>
                  {userProfile?.shoppingActivity || "Not set"}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Diet Preference:</Text>
                <Text style={styles.preferenceValue}>
                  {userProfile?.dietPreference || "None"}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Cooking For:</Text>
                <Text style={styles.preferenceValue}>
                  {userProfile?.cookingForPeople || 1} People
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Cuisine Preference:</Text>
                <Text style={styles.preferenceValue}>
                  {userProfile?.cuisinePreference || "None"}
                </Text>
              </View>
            </View>
          </View>

          {/* Account Status */}
          {/* <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>Account Status</Text>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Email Verification:</Text>
              <Text style={[
                styles.statusValue,
                { color: userProfile?.isVerified ? '#22C55E' : '#EF4444' }
              ]}>
                {userProfile?.isVerified ? "Verified" : "Not Verified"}
              </Text>
            </View>
            <Text style={styles.statusDate}>
              Member since: {new Date(userProfile?.createdAt).toLocaleDateString()}
            </Text>
          </View> */}

          {/* Encouraging Message */}
          <View style={styles.encouragingMessage}>
            <Text style={styles.messageText}>
              "Keep tracking your groceries and savings!"
            </Text>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;