import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const COLORS = {
  gamboge: "#EC9D04",
  xanthous: "#F0B51D",
  sinopia: "#C83701",
  turkeyRed: "#B00005",
  white: "#DADBDD", // Silver White
  black: "#000000",
  lightText: "rgba(255, 255, 255, 0.9)",
  mediumText: "rgba(255, 255, 255, 0.7)",
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
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
    marginTop: 23,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 10,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  heroImage: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 15,
    alignSelf: "center" ,
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
  carousel: {
    height: height * 0.25,
  },
  carouselDot: {
    backgroundColor: COLORS.mediumText,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeCarouselDot: {
    backgroundColor: COLORS.turkeyRed,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 3,
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
    color: COLORS.lightText,
    textAlign: "center",
  },
  ctaContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  ctaButton: {
    backgroundColor: COLORS.sinopia,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  appleButton: {
    backgroundColor: "#131010",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  socialText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
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
    color: COLORS.lightText,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  termsLink: {
    color: COLORS.turkeyRed,
    fontWeight: "bold",
  },
});

export default styles;
