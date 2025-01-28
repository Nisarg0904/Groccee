import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#36454F", // Charcoal Gray for contrast
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
    backgroundColor: "turkeyred",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  editButtonText: {
    color: "ghostwhite",
    fontSize: 12,
    fontWeight: "bold",
  },
  achievementsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "ghostwhite",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  achievements: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
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
    backgroundColor: "#FF6347", // Turkey Red
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
  encouragingMessage: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#2C5530", // Deep Forest Green for positivity
    borderRadius: 10,
    alignItems: "center",
  },
  messageText: {
    color: "ghostwhite",
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },

  logoutButton: {
    backgroundColor: "#FF0000", // Turkey Red
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
