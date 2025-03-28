import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const carouselSpacing = width * 0.05;

// Neumorphic constants
const BACKGROUND_COLOR = '#f0f0f3';
const LIGHT_SHADOW = '#ffffff';
const DARK_SHADOW = 'rgba(0, 0, 0, 0.1)';
const RED_ACCENT = '#FF4141';

const neumorphicShadow = {
  shadowColor: "#000",
  shadowOffset: {
    width: 6,
    height: 6,
  },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 8,
};

const neumorphicInset = {
  shadowColor: "#000",
  shadowOffset: {
    width: 1,
    height: 1,
  },
  shadowOpacity: 0.15,
  shadowRadius: 3,
  elevation: 2,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  sectionContainer: {
    marginVertical: 15,
  },
  // -----------------
  // Loading and Error styles
  // -----------------
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 65, 65, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: RED_ACCENT,
  },
  errorText: {
    color: '#555',
    fontSize: 14,
  },
  // -----------------
  // Tab Navigation styles
  // -----------------
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 65, 65, 0.15)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
    marginTop: 4,
  },
  activeTabText: {
    color: '#FF4141',
    fontWeight: '700',
  },
  // -----------------
  // SectionHeader styles
  // -----------------
  sectionHeaderContainer: {
    marginBottom: 15,
    position: "relative",
  },
  sectionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  sectionHeaderIcon: {
    marginRight: 10,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    letterSpacing: 0.5,
  },
  // -----------------
  // Header Container styles
  // -----------------
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    ...neumorphicShadow,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  emailText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: BACKGROUND_COLOR,
    ...neumorphicShadow,
    padding: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  // -----------------
  // Summary Card styles
  // -----------------
  summaryCard: {
    backgroundColor: RED_ACCENT,
    padding: 22,
    borderRadius: 16,
    marginBottom: 25,
    ...neumorphicShadow,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryCount: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginBottom: 16,
  },
  viewAllButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  viewAllButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  // -----------------
  // Categories styles
  // -----------------
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoryCard: {
    width: 130,
    height: 110,
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    justifyContent: 'space-between',
    ...neumorphicShadow,
  },
  categoryIcon: {
    marginBottom: 10,
  },
  categoryName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  categoryCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  // -----------------
  // Recent Items styles
  // -----------------
  recentItemsContainer: {
    marginTop: 10,
  },
  recentItemCard: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  recentItemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    textAlign: 'center',
  },
  recentItemDetails: {
    flex: 1,
  },
  recentItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  recentItemQuantity: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  recentItemArrow: {
    marginLeft: 5,
  },
  // -----------------
  // Shopping Items styles
  // -----------------
  shoppingItemsContainer: {
    marginTop: 10,
  },
  shoppingItemCard: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  shoppingItemCheckbox: {
    marginRight: 12,
  },
  shoppingItemDetails: {
    flex: 1,
  },
  shoppingItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  shoppingItemChecked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  shoppingItemQuantity: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  shoppingItemCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: '#FF4141',
  },
  shoppingItemCategoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  // -----------------
  // Insights styles
  // -----------------
  insightsContainer: {
    marginTop: 10,
  },
  insightCard: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  insightIcon: {
    marginRight: 16,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  insightText: {
    fontSize: 14,
    color: '#999',
  },
  // -----------------
  // Statistics styles
  // -----------------
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4141',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  // -----------------
  // Floating Action Button styles
  // -----------------
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4141',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
  },
  // -----------------
  // Expiring Items (Card) styles
  // -----------------
  expiringItemCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderLeftWidth: 0,
    ...neumorphicShadow,
    flexDirection: "row",
    alignItems: "center",
  },
  expiringItemRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expiringItemIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    marginRight: 15,
    ...neumorphicInset,
  },
  expiringItemTextContainer: {
    flex: 1,
  },
  expiringItemName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
  },
  expiringItemExpiry: {
    fontSize: 14,
    fontWeight: '500',
    color: "#555",
    marginTop: 3,
  },
  expiringItemDays: {
    fontSize: 14,
    fontWeight: '500',
    color: "#555",
    marginTop: 2,
  },
  // -----------------
  // Shopping List Preview styles
  // -----------------
  shoppingListPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RED_ACCENT,
    padding: 18,
    borderRadius: 16,
    marginVertical: 20,
    ...neumorphicShadow,
  },
  shoppingListIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginRight: 15,
  },
  shoppingListInfo: {
    flex: 1,
  },
  shoppingListTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shoppingListCount: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  // -----------------
  // Carousel styles
  // -----------------
  carouselContainer: {
    paddingHorizontal: carouselSpacing / 2,
  },
  carouselItem: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: BACKGROUND_COLOR,
    ...neumorphicShadow,
  },
  carouselImage: {
    width: "100%",
    height: 150,  
    aspectRatio: 16/9,
    borderRadius: 8,
  },
  carouselButton: {
    backgroundColor: RED_ACCENT,
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
  // Expense Section styles
  // -----------------
  expenseCard: {
    backgroundColor: "#121212",
    padding: 15,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  expenseTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  expenseDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    alignItems: "center",
  },
  expenseDetailText: {
    fontSize: 16,
    color: "#999",
    flex: 1,
  },
  expenseToggleText: {
    textAlign: "center",
    color: "#FF4141",
    fontWeight: "bold",
    marginTop: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
    marginLeft: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF4141",
  },
  // -----------------
  // Chart container styles
  // -----------------
  chartContainer: {
    backgroundColor: "#121212",
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
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
    backgroundColor: "#333",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  chartSwitcherButtonActive: {
    backgroundColor: "#FF4141",
  },
  chartSwitcherButtonText: {
    color: "#fff",
  },
  chartSwitcherButtonTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
  // -----------------
  // Navigation & Miscellaneous styles
  // -----------------
  button: {
    backgroundColor: RED_ACCENT,
    padding: 14,
    borderRadius: 12,
    marginVertical: 10,
    width: "60%",
    alignItems: "center",
    ...neumorphicShadow,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#dc3545",
    padding: 14,
    borderRadius: 12,
    width: "60%",
    alignItems: "center",
    alignSelf: "center",
    ...neumorphicShadow,
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
    backgroundColor: BACKGROUND_COLOR,
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    ...neumorphicShadow,
  },
  notificationText: {
    fontSize: 16,
    color: "#555",
  },
  // -----------------
  // User Action styles
  // -----------------
  userActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    ...neumorphicShadow,
  },
  userActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 15,
  },

  // Recipe Generator styles
recipeGeneratorCard: {
  borderRadius: 16,
  marginVertical: 10,
  overflow: 'hidden',
  ...neumorphicShadow,
},
recipeGeneratorCardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 18,
  backgroundColor: '#5E35B1', // Purple color that complements your red accent
},
recipeGeneratorIconContainer: {
  width: 60,
  height: 60,
  borderRadius: 30,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  marginRight: 16,
},
recipeGeneratorTextContainer: {
  flex: 1,
},
recipeGeneratorTitle: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
},
recipeGeneratorDescription: {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: 14,
  marginTop: 4,
},
});

export default styles;