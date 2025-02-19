import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const carouselSpacing = width * 0.05;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  sectionContainer: {
    marginVertical: 20,
  },
  // -----------------
  // SectionHeader styles
  // -----------------
  sectionHeaderContainer: {
    marginBottom: 10,
    position: "relative",
  },
  sectionHeaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    borderRadius: 4,
  },
  sectionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sectionHeaderIcon: {
    marginRight: 8,
  },
  sectionHeaderText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
    // Replace "System" with your custom font name if needed.
    fontFamily: "System",
  },
  sectionHeaderDivider: {
    marginTop: 4,
    height: 2,
    backgroundColor: "#007BFF",
    width: "100%",
    borderRadius: 2,
  },
  // -----------------
  // Carousel styles
  // -----------------
  carouselContainer: {
    paddingHorizontal: carouselSpacing / 2,
  },
  carouselItem: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  carouselImage: {
    width: "100%",
    height: 150,  
    aspectRatio: 16/9,
    borderRadius: 8,
  },
  carouselButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 0,
    alignItems: "center",
    width: "100%",
    alignSelf: "stretch", // Force the button to match parent's width
  },
  carouselButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // -----------------
  // Expiring Items (Card) styles
  // -----------------
  expiringItemCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  expiringItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  expiringItemIcon: {
    marginRight: 8,
  },
  expiringItemTextContainer: {
    flex: 1,
  },
  expiringItemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  expiringItemExpiry: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  expiringItemDays: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  // -----------------
  // Expense Section styles
  // -----------------
  expenseCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  expenseTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  expenseDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    alignItems: "center",
  },
  expenseDetailText: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
  expenseToggleText: {
    textAlign: "center",
    color: "#007BFF",
    fontWeight: "bold",
    marginTop: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
    marginLeft: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007BFF",
  },
  // -----------------
  // Chart container styles
  // -----------------
  chartContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    marginVertical: 10,
    alignItems: "center",
  },
  chartSwitcherContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  chartSwitcherButton: {
    padding: 10,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  chartSwitcherButtonActive: {
    backgroundColor: "#007BFF",
  },
  chartSwitcherButtonText: {
    color: "#333",
  },
  chartSwitcherButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  // -----------------
  // Navigation & Miscellaneous styles
  // -----------------
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    padding: 12,
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navButtonsContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  notificationText: {
    fontSize: 16,
    color: "#555",
  },
});

export default styles;
