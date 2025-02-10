import React, { useEffect, useState, useRef } from "react";
import { View, Text, SafeAreaView, StatusBar, ScrollView, Image, Dimensions, Platform } from "react-native";
import Swiper from "react-native-swiper";
import MaskedView from "@react-native-masked-view/masked-view";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import styles, { COLORS } from "../../styles/WelcomePageStyles";

// Import FastImage ONLY if not using Expo
let FastImage;
if (Platform.OS !== "web" && !global.__expo) {
  FastImage = require("react-native-fast-image").default;
}

const WelcomePage = () => {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get("window");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const renderFeature = (icon, title = "Feature Title", iconColor = COLORS.red) => (
    <View style={styles.featureItem} key={title}>
      <Feather name={icon} size={24} color={iconColor} />
      <Text style={styles.featureTitle}>{title}</Text>
    </View>
  );
  

  // Load Custom Font (Fonarto)
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        "Fonarto": require("../../../assets/fonts/Fonarto.ttf"), // ✅ Correct font path
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Fix for FastImage local image loading
  const heroImages = [
    require("../../../assets/hero1.webp"),
    require("../../../assets/hero2.webp"),
    require("../../../assets/hero3.webp"),
    require("../../../assets/hero4.webp"),
    require("../../../assets/hero5.webp"),
    require("../../../assets/hero6.webp"),
  ];

  const heroURIs = heroImages.map((img) => Image.resolveAssetSource(img).uri);

  // Preload images (only if using FastImage)
  useEffect(() => {
    if (FastImage) {
      FastImage.preload(heroURIs.map((uri) => ({ uri })));
    }
  }, []);


  // Show loading state if fonts are not loaded
  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Custom Font Title with Gradient Mask */}
        <View style={styles.titleContainer}>
          <Text 
            style={{
              fontFamily: "Fonarto",
              fontSize: 58,
              color: "white",
              textShadowColor: "#FF3131",
              textShadowRadius: 3,
              textShadowOffset: { width: -3, height: -3 },  
            }}
          >
            GROCEE
          </Text>
        </View>

        {/* Hero Section with Swiper */}
        <View style={styles.heroSection}>
          <Swiper
            style={styles.carousel}
            autoplay
            autoplayTimeout={2}
            showsPagination={false}
            dotStyle={styles.carouselDot}
            activeDotStyle={styles.activeCarouselDot}
          >
            {FastImage
              ? heroURIs.map((uri, index) => (
                  <FastImage key={index} source={{ uri }} style={styles.heroImage} resizeMode="cover" />
                ))
              : heroImages.map((img, index) => (
                  <Image key={index} source={img} style={styles.heroImage} resizeMode="cover" />
                ))}
          </Swiper>
          <Text style={styles.heroText}>Simplify Your Grocery Shopping</Text>

        </View>

        

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          {renderFeature("list", "Easy List Management", )}
          {renderFeature("users", "Real-Time Collaboration")}
          {renderFeature("shopping-bag", "Smart Suggestions")}
        </View>

        {/* Call-to-Action Button */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("SignUp")}
            activeOpacity={0.7}
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        {/* Sign-In Link */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("SignIn")}
          activeOpacity={0.7}
        >
          <Text style={styles.signInText}>Already have an account? Sign In</Text>
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text style={styles.termsLink}>Terms and Conditions</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomePage;
