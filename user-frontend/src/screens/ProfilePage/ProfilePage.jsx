import React, { useContext } from "react";
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../../styles/ProfilePageStyles";
import { UserContext } from "../../contexts/UserContext";

const ProfilePage = ({ navigation, route }) => {
  const { setCurrentUser, setToken } = useContext(UserContext);

  const handleLogout = () => {
    // Clear user data to force re-render and load the AuthNavigator (Welcome screen)
    setCurrentUser(null);
    setToken(null);
    // Reset the navigation stack so that the Welcome screen is the only screen
    navigation.reset({
      index: 0,
      routes: [{ name: "Welcome" }],
    });
  };

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
            <Text style={styles.username}>@username</Text>
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditProfilePage")}
            >
              <Text style={styles.editButtonText}>EDIT</Text>
            </TouchableOpacity>
          </View>

          {/* Achievements Section */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievements}>
              <View style={[styles.achievementIcon, styles.greenBadge]} />
              <View style={[styles.achievementIcon, styles.orangeBadge]} />
              <View style={[styles.achievementIcon, styles.deepForestBadge]} />
              <View style={[styles.achievementIcon, styles.richPurpleBadge]} />
              <View style={[styles.achievementIcon, styles.deepNavyBadge]} />
            </View>
          </View>

          {/* Last Activities Section */}
          <View style={styles.activitiesSection}>
            <Text style={styles.sectionTitle}>Last Activities</Text>
            <View style={styles.activities}>
              <View style={[styles.activityCard, styles.moneySpentCard]}>
                <Text style={styles.activityCardValue}>2000$</Text>
                <Text style={styles.activityCardLabel}>Money Spent</Text>
              </View>
              <View style={[styles.activityCard, styles.moneySavedCard]}>
                <Text style={styles.activityCardValue}>120$</Text>
                <Text style={styles.activityCardLabel}>Money Saved</Text>
              </View>
              <View style={[styles.activityCard, styles.lastItemCard]}>
                <Text style={styles.activityCardValue}>Strawberries</Text>
                <Text style={styles.activityCardLabel}>Last Item Used</Text>
              </View>
            </View>
          </View>

          {/* Summary Section */}
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summary}>
              <Text style={styles.summaryItem}>Total Groceries: 45</Text>
              <Text style={styles.summaryItem}>Frequently Used Item: Milk</Text>
            </View>
          </View>

          {/* Encouraging Message */}
          <View style={styles.encouragingMessage}>
            <Text style={styles.messageText}>
              "You're doing great! Keep tracking your groceries and savings!"
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