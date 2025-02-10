import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Main container
  container: {
    // No flex: 1 — it can interfere with ScrollView height
    backgroundColor: "black",
    padding: 20,
  },

  // Profile Section
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#36454F", // Charcoal Gray
    padding: 15,
    borderRadius: 10,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    color: "ghostwhite",
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    color: "ghostwhite",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#E52B50", // Turkey Red
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  editButtonText: {
    color: "ghostwhite",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Achievements Section
  achievementsSection: {
    marginBottom: 20,
  },
  achievements: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "ghostwhite",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  greenBadge: {
    backgroundColor: "#2ECC71",
  },
  orangeBadge: {
    backgroundColor: "#E67E22",
  },
  deepForestBadge: {
    backgroundColor: "#2C5530",
  },
  richPurpleBadge: {
    backgroundColor: "#9B59B6",
  },
  deepNavyBadge: {
    backgroundColor: "#1B264F",
  },

  // Last Activities Section
  activitiesSection: {
    marginBottom: 20,
  },
  activities: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  activityCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  moneySpentCard: {
    backgroundColor: "#E52B50", // Turkey Red
  },
  moneySavedCard: {
    backgroundColor: "#2C5530", // Deep Forest Green
  },
  lastItemCard: {
    backgroundColor: "#1B264F", // Deep Navy Blue
  },
  activityCardValue: {
    fontSize: 16,
    color: "ghostwhite",
    fontWeight: "bold",
    marginBottom: 5,
  },
  activityCardLabel: {
    fontSize: 12,
    color: "ghostwhite",
  },

  // Summary Section
  summarySection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#36454F", // Charcoal Gray
    borderRadius: 10,
  },
  summary: {
    marginTop: 10,
  },
  summaryItem: {
    color: "ghostwhite",
    fontSize: 14,
    marginBottom: 5,
  },

  // Encouraging Message
  encouragingMessage: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2C5530", // Deep Forest Green
    borderRadius: 10,
    alignItems: "center",
  },
  messageText: {
    color: "ghostwhite",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },

  // Logout Button
  logoutButton: {
    backgroundColor: "#FF0000", // Bright Red
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: "center",
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#F8F8FF", // Ghost White
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
