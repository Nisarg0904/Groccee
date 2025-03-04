import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset"; // Expo Asset for preloading images
import styles, { COLORS } from "../../styles/WelcomePageStyles";

// Import FastImage ONLY if not using Expo (we are using Expo so this won't be used)
let FastImage;
if (Platform.OS !== "web" && !global.__expo) {
  FastImage = require("react-native-fast-image").default;
}

const WelcomePage = () => {
  const navigation = useNavigation();
  const { width: screenWidth } = Dimensions.get("window");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track when images are preloaded

  const renderFeature = (
    icon,
    title = "Feature Title",
    iconColor = COLORS.red
  ) => (
    <View style={styles.featureItem} key={title}>
      <Feather name={icon} size={24} color={iconColor} />
      <Text style={styles.featureTitle}>{title}</Text>
    </View>
  );

  // Load custom font
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Fonarto: require("../../../assets/fonts/Fonarto.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Define hero images (local assets in .webp format)
  const heroImages = [
    require("../../../assets/hero1.webp"),
    require("../../../assets/hero2.webp"),
    require("../../../assets/hero3.webp"),
    require("../../../assets/hero4.webp"),
    require("../../../assets/hero5.webp"),
    require("../../../assets/hero6.webp"),
  ];

  // Preload images using Expo Asset
  useEffect(() => {
    async function loadImages() {
      try {
        // Preload each image asset
        const imageAssets = heroImages.map((img) =>
          Asset.fromModule(img).downloadAsync()
        );
        await Promise.all(imageAssets);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true); // Even on error, let the page render.
      }
    }
    loadImages();
  }, []);

  // Preload using FastImage if available (won't be used on Expo)
  useEffect(() => {
    if (FastImage) {
      const heroURIs = heroImages.map(
        (img) => Image.resolveAssetSource(img).uri
      );
      FastImage.preload(heroURIs.map((uri) => ({ uri })));
    }
  }, []);

  // Show loader until fonts and images are loaded
  if (!fontsLoaded || !imagesLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.red} />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title with custom font */}
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
            GROCCEE
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
              ? heroImages.map((img, index) => (
                  <FastImage
                    key={index}
                    source={img}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                ))
              : heroImages.map((img, index) => (
                  <Image
                    key={index}
                    source={img}
                    style={styles.heroImage}
                    resizeMode="cover"
                  />
                ))}
          </Swiper>
          <Text style={styles.heroText}>Simplify Your Grocery Shopping</Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          {renderFeature("list", "Easy List Management")}
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
          <Text style={styles.signInText}>
            Already have an account? Sign In
          </Text>
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
