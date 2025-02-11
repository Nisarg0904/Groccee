// frontend/styles/MainMenuPageStyles.js

import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const carouselSpacing = width * 0.05;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f9fa"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center"
  },
  sectionContainer: {
    marginVertical: 20
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333"
  },
  // Carousel styles
  carouselContainer: {
    paddingHorizontal: carouselSpacing / 2
  },
  carouselItem: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff"
  },
  carouselImage: {
    width: "100%",
    height: 150,
    borderRadius: 8
  },
  carouselButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center"
  },
  carouselButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  // Table styles
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd"
  },
  tableHeaderText: {
    fontWeight: "bold",
    color: "#007BFF"
  },
  tableCell: {
    flex: 1,
    textAlign: "center"
  },
  // Expense Section styles
  expenseCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8
  },
  expenseTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333"
  },
  expenseDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5
  },
  expenseDetailText: {
    fontSize: 16,
    color: "#555"
  },
  // Navigation button styles (if needed elsewhere)
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: "60%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    alignSelf: "center"
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
  navButtonsContainer: {
    marginVertical: 20,
    alignItems: "center"
  },
  // Additional styles for Notifications
  notificationItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  notificationText: {
    fontSize: 16,
    color: "#555"
  }
});

export default styles;
