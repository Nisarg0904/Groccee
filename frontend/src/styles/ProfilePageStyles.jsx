// import { StyleSheet } from "react-native";

// export default StyleSheet.create({
//   // Main container
//   container: {
//     // No flex: 1 — it can interfere with ScrollView height
//     backgroundColor: "black",
//     padding: 20,
//   },

//   // Profile Section
//   profileSection: {
//     alignItems: "center",
//     marginBottom: 20,
//     backgroundColor: "#36454F", // Charcoal Gray
//     padding: 15,
//     borderRadius: 10,
//     position: "relative",
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 20,
//     color: "ghostwhite",
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   description: {
//     color: "ghostwhite",
//     fontSize: 14,
//     textAlign: "center",
//     marginBottom: 15,
//   },
//   editButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     backgroundColor: "#E52B50", // Turkey Red
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderRadius: 20,
//   },
//   editButtonText: {
//     color: "ghostwhite",
//     fontSize: 12,
//     fontWeight: "bold",
//   },

//   // Achievements Section
//   achievementsSection: {
//     marginBottom: 20,
//   },
//   achievements: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     color: "ghostwhite",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   achievementIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginHorizontal: 5,
//   },
//   greenBadge: {
//     backgroundColor: "#2ECC71",
//   },
//   orangeBadge: {
//     backgroundColor: "#E67E22",
//   },
//   deepForestBadge: {
//     backgroundColor: "#2C5530",
//   },
//   richPurpleBadge: {
//     backgroundColor: "#9B59B6",
//   },
//   deepNavyBadge: {
//     backgroundColor: "#1B264F",
//   },

//   // Last Activities Section
//   activitiesSection: {
//     marginBottom: 20,
//   },
//   activities: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   activityCard: {
//     flex: 1,
//     marginHorizontal: 5,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//   },
//   moneySpentCard: {
//     backgroundColor: "#E52B50", // Turkey Red
//   },
//   moneySavedCard: {
//     backgroundColor: "#2C5530", // Deep Forest Green
//   },
//   lastItemCard: {
//     backgroundColor: "#1B264F", // Deep Navy Blue
//   },
//   activityCardValue: {
//     fontSize: 16,
//     color: "ghostwhite",
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   activityCardLabel: {
//     fontSize: 12,
//     color: "ghostwhite",
//   },

//   // Summary Section
//   summarySection: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: "#36454F", // Charcoal Gray
//     borderRadius: 10,
//   },
//   summary: {
//     marginTop: 10,
//   },
//   summaryItem: {
//     color: "ghostwhite",
//     fontSize: 14,
//     marginBottom: 5,
//   },

//   // Encouraging Message
//   encouragingMessage: {
//     marginTop: 20,
//     padding: 15,
//     backgroundColor: "#2C5530", // Deep Forest Green
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   messageText: {
//     color: "ghostwhite",
//     fontSize: 14,
//     textAlign: "center",
//     fontStyle: "italic",
//   },

//   // Logout Button
//   logoutButton: {
//     backgroundColor: "#FF0000", // Bright Red
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//     alignSelf: "center",
//     marginVertical: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   logoutButtonText: {
//     color: "#F8F8FF", // Ghost White
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
// });


import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  username: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 16,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  preferencesSection: {
    marginTop: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  preferences: {
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  preferenceLabel: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  preferenceValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusSection: {
    marginTop: 24,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 16,
    color: '#A0A0A0',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusDate: {
    fontSize: 14,
    color: '#A0A0A0',
    textAlign: 'center',
    marginTop: 8,
  },
  encouragingMessage: {
    marginTop: 24,
    backgroundColor: '#7C3AED20',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});