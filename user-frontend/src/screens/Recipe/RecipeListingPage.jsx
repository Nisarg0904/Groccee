import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UserContext } from "../../contexts/UserContext";
import { fetchAllRecipes, generateRecipes } from "../../services/recipeApi";
import styles from '../../styles/RecipeListingStyles';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const RecipeListingScreen = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  
  // Track expanded state for each recipe
  const [expandedInstructions, setExpandedInstructions] = useState({});
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Fetch recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  // Fetch existing recipes
  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAllRecipes(token);
      setRecipes(response.recipes || []);
      animateRecipes();
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate new recipes
  const handleGenerateRecipes = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await generateRecipes(token);
      
      // Reset animations for new content
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      setRecipes(response.recipes || []);
      setExpandedInstructions({}); // Reset expanded states
      animateRecipes();
      
      // Show success message
      Alert.alert(
        "Success",
        "New recipes generated based on your ingredients",
        [{ text: "OK" }]
      );
    } catch (err) {
      console.error('Error generating recipes:', err);
      setError('Failed to generate recipes. Please try again.');
    } finally {
      setGenerating(false);
    }
  };
  
  // Animate recipes into view
  const animateRecipes = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  // Toggle instructions expanded state
  const toggleInstructions = (recipeId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedInstructions(prev => ({
      ...prev,
      [recipeId]: !prev[recipeId]
    }));
  };
  
  // Get visible instructions for a recipe
  const getVisibleInstructions = (recipe) => {
    const steps = recipe.description
      .split(/\d+\./)
      .filter(step => step.trim())
      .map(step => step.trim());
    
    const isExpanded = expandedInstructions[recipe.recipeId];
    return isExpanded ? steps : steps.slice(0, 2);
  };
  
  // Helper to get ingredient icon
  const getIngredientIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('milk')) return 'cup-water';
    if (lowerName.includes('egg')) return 'egg';
    if (lowerName.includes('bread')) return 'bread-slice';
    if (lowerName.includes('cheese')) return 'cheese';
    if (lowerName.includes('chicken')) return 'food-drumstick';
    if (lowerName.includes('beef') || lowerName.includes('steak')) return 'food-steak';
    if (lowerName.includes('pasta')) return 'pasta';
    if (lowerName.includes('rice')) return 'rice';
    if (lowerName.includes('tomato')) return 'food-apple';
    if (lowerName.includes('vegetable') || lowerName.includes('carrot')) return 'carrot';
    if (lowerName.includes('fruit') || lowerName.includes('apple')) return 'fruit-watermelon';
    if (lowerName.includes('fish') || lowerName.includes('salmon')) return 'fish';
    if (lowerName.includes('onion')) return 'food';
    if (lowerName.includes('garlic')) return 'food';
    if (lowerName.includes('oil')) return 'oil';
    return 'food-variant';
  };
  
  // Get color based on cuisine
  const getCuisineColor = (cuisine) => {
    const cuisineColors = {
      'Italian': '#4CAF50',
      'Mexican': '#FF9800',
      'Chinese': '#F44336',
      'Indian': '#9C27B0',
      'American': '#2196F3',
      'Mediterranean': '#009688',
      'Japanese': '#E91E63',
      'Thai': '#CDDC39',
      'French': '#3F51B5',
      'Asian': '#FF5722',
    };
    
    return cuisineColors[cuisine] || '#5E35B1'; // Default to purple
  };
  
  // Render instructions section with collapse/expand functionality
  const renderInstructions = (recipe) => {
    const visibleSteps = getVisibleInstructions(recipe);
    const allSteps = recipe.description
      .split(/\d+\./)
      .filter(step => step.trim())
      .map(step => step.trim());
    
    const isExpanded = expandedInstructions[recipe.recipeId];
    const hasMoreSteps = allSteps.length > 2;
    
    return (
      <View style={styles.instructionsContainer}>
        <View style={styles.instructionHeader}>
          <Text style={styles.sectionSubtitle}>Instructions</Text>
          {hasMoreSteps && (
            <TouchableOpacity 
              onPress={() => toggleInstructions(recipe.recipeId)}
              style={styles.toggleButton}
            >
              <Text style={styles.toggleButtonText}>
                {isExpanded ? 'Collapse' : 'Show All'}
              </Text>
              <MaterialCommunityIcons 
                name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color="#5E35B1" 
              />
            </TouchableOpacity>
          )}
        </View>
        
        {visibleSteps.map((step, idx) => (
          <View key={idx} style={styles.instructionStep}>
            <View style={styles.instructionNumberContainer}>
              <Text style={styles.instructionNumber}>{idx + 1}</Text>
            </View>
            <Text style={styles.instructionText}>{step}</Text>
          </View>
        ))}
        
        {!isExpanded && hasMoreSteps && (
          <TouchableOpacity 
            onPress={() => toggleInstructions(recipe.recipeId)}
            style={styles.showMoreButton}
          >
            <Text style={styles.showMoreText}>
              +{allSteps.length - 2} more steps
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recipe Recommendations</Text>
      </View>
      
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.generateButton}
          onPress={handleGenerateRecipes}
          disabled={generating || loading}
        >
          {generating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
          )}
          <Text style={styles.generateButtonText}>
            {generating ? 'Generating...' : 'Generate New Recipes'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5E35B1" />
          <Text style={styles.loadingText}>Loading your recipes...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>
                Based on your ingredients
              </Text>
              
              {recipes.map((recipe, index) => (
                <Animated.View
                  key={recipe.recipeId}
                  style={[
                    styles.recipeCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: Animated.multiply(slideAnim, new Animated.Value(1 + index * 0.3)) }],
                    },
                  ]}
                >
                  <View style={styles.recipeHeader}>
                    <View style={[styles.cuisineTag, { backgroundColor: getCuisineColor(recipe.cuisine) }]}>
                      <Text style={styles.cuisineText}>{recipe.cuisine}</Text>
                    </View>
                    
                    <View style={styles.recipeStats}>
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{recipe.timeToCook} min</Text>
                      </View>
                      
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons name="account-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.recipeName}>{recipe.name}</Text>
                  
                  {/* Collapsible Instructions */}
                  {renderInstructions(recipe)}
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionSubtitle}>Ingredients</Text>
                  <View style={styles.ingredientsContainer}>
                    {recipe.ingredients.map((ingredient, idx) => (
                      <View key={idx} style={styles.ingredientItem}>
                        <View style={styles.ingredientIconContainer}>
                          <MaterialCommunityIcons 
                            name={getIngredientIcon(ingredient.ingredientName)} 
                            size={16} 
                            color="#5E35B1" 
                          />
                        </View>
                        <Text style={styles.ingredientText}>
                          {ingredient.quantity} {ingredient.unit} {ingredient.ingredientName}
                        </Text>
                      </View>
                    ))}
                  </View>
                  
                  {recipe.allergies && recipe.allergies.length > 0 && (
                    <>
                      <Text style={styles.sectionSubtitle}>Allergy Information</Text>
                      <View style={styles.allergyContainer}>
                        {recipe.allergies.map((allergy, idx) => (
                          <View 
                            key={idx} 
                            style={[
                              styles.allergyTag,
                              { 
                                backgroundColor: 
                                  allergy.severity === 'Severe' ? 'rgba(244, 67, 54, 0.1)' : 
                                  allergy.severity === 'Moderate' ? 'rgba(255, 152, 0, 0.1)' : 
                                  'rgba(76, 175, 80, 0.1)' 
                              }
                            ]}
                          >
                            <MaterialCommunityIcons 
                              name="alert-circle" 
                              size={14} 
                              color={
                                allergy.severity === 'Severe' ? '#F44336' : 
                                allergy.severity === 'Moderate' ? '#FF9800' : 
                                '#4CAF50'
                              } 
                            />
                            <Text style={styles.allergyText}>
                              {allergy.allergen} ({allergy.severity})
                            </Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                  
                  <View style={styles.recipeActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="bookmark-outline" size={20} color="#5E35B1" />
                      <Text style={styles.actionButtonText}>Save</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="share-variant" size={20} color="#5E35B1" />
                      <Text style={styles.actionButtonText}>Share</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="shopping" size={20} color="#5E35B1" />
                      <Text style={styles.actionButtonText}>Shop</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="food-variant" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No recipes found</Text>
              <Text style={styles.emptySubtext}>Tap the button above to generate recipes based on your ingredients</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default RecipeListingScreen;