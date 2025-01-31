import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Animated, Image, ScrollView } from "react-native";
import Swiper from "react-native-swiper";
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles, { COLORS } from "../../styles/WelcomePageStyles";

const WelcomePage = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderFeature = (icon, title, description) => (
    <View style={styles.featureItem}>
      <Feather name={icon} size={24} color={COLORS.sinopia} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.black }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Text style={styles.appName}>Grocee</Text>
            <Image source={require("../../../assets/logo.png")} style={styles.logo} />
          </View>
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
            <Image source={require("../../../assets/hero1.jpg")} style={styles.heroImage} />
            <Image source={require("../../../assets/hero2.jpg")} style={styles.heroImage} />
            <Image source={require("../../../assets/hero3.jpg")} style={styles.heroImage} />
            <Image source={require("../../../assets/hero4.jpg")} style={styles.heroImage} />
            <Image source={require("../../../assets/hero5.jpg")} style={styles.heroImage} />
            <Image source={require("../../../assets/hero6.jpg")} style={styles.heroImage} />
            
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

        {/* Social Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
            <AntDesign name="google" size={24} color="white" />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.appleButton} onPress={() => {}}>
            <MaterialIcons name="apple" size={24} color="white" />
            <Text style={styles.socialText}>Apple</Text>
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
          By continuing, you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WelcomePage;
