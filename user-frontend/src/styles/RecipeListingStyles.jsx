import { StyleSheet } from 'react-native';

// Neumorphic constants - matching your app's existing design
const BACKGROUND_COLOR = '#f0f0f3';
const LIGHT_SHADOW = '#ffffff';
const DARK_SHADOW = 'rgba(0, 0, 0, 0.1)';
const PURPLE_ACCENT = '#5E35B1';
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    ...neumorphicInset,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 40, // To balance with back button
  },
  
  // Action Bar
  actionBar: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: BACKGROUND_COLOR,
  },
  generateButton: {
    backgroundColor: PURPLE_ACCENT,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    ...neumorphicShadow,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  
  // Content Containers
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
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
  
  // Section Headers
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 5,
  },
  
  // Recipe Card
  recipeCard: {
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...neumorphicShadow,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cuisineTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cuisineText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  recipeStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  recipeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  
  // Instructions - Updated for collapsible functionality
  instructionsContainer: {
    marginTop: 5,
    marginBottom: 15,
  },
  instructionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButtonText: {
    fontSize: 14,
    color: PURPLE_ACCENT,
    marginRight: 4,
    fontWeight: '500',
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PURPLE_ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  instructionNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  showMoreButton: {
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: -4,
  },
  showMoreText: {
    color: PURPLE_ACCENT,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Ingredients
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingredientIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BACKGROUND_COLOR,
    ...neumorphicInset,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 14,
    color: '#666',
  },
  
  // Allergies
  allergyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  allergyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  allergyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  
  // Recipe Actions
  recipeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    ...neumorphicInset,
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default styles;