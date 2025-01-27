import React, { useEffect } from "react"
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Animated, Image, ScrollView } from "react-native"
// import { LinearGradient } from "expo-linear-gradient"
import { MaterialIcons, AntDesign, Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import styles, { COLORS } from "../../styles/WelcomePageStyles"

const WelcomePage = () => {
  const navigation = useNavigation()
  const fadeAnim = new Animated.Value(0)

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start()
  }, [])

  const renderFeature = (icon, title, description) => (
    <View style={styles.featureItem}> 
      <Feather name={icon} size={24} color={COLORS.sinopia} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.black }]}>
      <StatusBar barStyle="light-content" />
      {/* <LinearGradient
        colors={[COLORS.black]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      > */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            }}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoWrapper}>
                <Text style={styles.appName}>GroceryMate</Text>
                <Image source={require("../../../assets/logo.png")} style={styles.logo} />
              </View>
            </View>

            <View style={styles.heroSection}>
              <Image source={require("../../../assets/hero-section.jpg")} style={styles.heroImage} />
              <Text style={styles.heroText}>Simplify Your Grocery Shopping</Text>
            </View>

            <View style={styles.featuresContainer}>
              {renderFeature("list", "Easy List Management", "Create and manage your grocery lists effortlessly")}
              {renderFeature("users", "Real-Time Collaboration", "Share lists with family members in real-time")}
              {renderFeature("shopping-bag", "Smart Suggestions", "Receive personalized product recommendations")}
            </View>

            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => navigation.navigate("SignUp")}
                activeOpacity={0.7}
              >
                <Text style={styles.ctaText}>Get Started</Text> 
              </TouchableOpacity>
            </View>

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

            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => navigation.navigate("SignIn")}
              activeOpacity={0.7}
            >
              <Text style={styles.signInText}>Already have an account? Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our <Text style={styles.termsLink}>Terms and Conditions</Text>.
            </Text>
          </Animated.View>
        </ScrollView>
      {/* </LinearGradient> */}
    </SafeAreaView>
  )
}

export default WelcomePage

