import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  white: "#DADBDD",
  black: "#000000",
  lightGray: "rgba(255, 255, 255, 0.3)",
  red: "#FF3131", // 🔥 Added red for accents
  darkRed: "#B00020", // 🔥 Darker red for depth
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  titleText: {
    fontSize: 70,
    color: COLORS.white, // ✅ White text
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: COLORS.black, // ✅ Black outline effect
    textShadowOffset: { width: 2, height: 2 }, // ✅ Adjust thickness
    textShadowRadius: 3, // ✅ Slight blur to create the outline effect
  },
  titleShadow: {
    fontSize: 70,
    color: "transparent", // ✅ Transparent text, only shadow is visible
    textAlign: "center",
    fontWeight: "bold",
    textShadowColor: COLORS.red, // ✅ Red glow effect
    textShadowOffset: { width: 0, height: 0 }, // ✅ Keeps the glow centered
    textShadowRadius: 10, // ✅ Increase for a stronger glow
    position: "absolute",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 40,
    fontFamily: "Fonarto",
    textShadowColor: COLORS.lightGray, //  Subtle shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  shadowText: {
    fontSize: 60,
    fontFamily: "Fonarto", 
    color: COLORS.white,
    textAlign: "center",
    letterSpacing: 5, //  Spacing 
    fontWeight: "900", //  Ensure it's bold
    textShadowColor: COLORS.lightGray, //  Subtle shadow
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  loadingText: {
    fontSize: 24,
    color: COLORS.white,
    textAlign: "center",
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroImage: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: COLORS.lightGray, // Prevents blank flash when loading
  },
  heroText: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: "center",
    width: width * 0.28,
    color: COLORS.red,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: "center",
  },
  ctaContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  ctaButton: {
    backgroundColor: COLORS.red, // 🔥 Red CTA button
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: COLORS.darkRed, // 🔥 Dark red shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  signInButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  signInText: {
    color: COLORS.white,
    fontSize: 16,
    textDecorationLine: "underline",
  },
  termsText: {
    fontSize: 12,
    color: COLORS.lightGray,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  termsLink: {
    color: COLORS.red, // 🔥 Red terms link for emphasis
    fontWeight: "bold",
  },
  carousel: {
    height: height * 0.25,
  },
  carouselDot: {
    backgroundColor: COLORS.lightGray,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeCarouselDot: {
    backgroundColor: COLORS.red, // 🔥 Active dot in red for contrast
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});

export default styles;
