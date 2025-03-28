import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "./WelcomePageStyles";

// Get device dimensions for responsive design
const { width } = Dimensions.get("window");
const inputWidth = width * 0.85; // 85% of screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: width < 380 ? 28 : 32,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: width < 380 ? 20 : 24,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "Poppins-Medium",
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  input: {
    width: inputWidth,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    color: "#FFFFFF",
    fontSize: width < 380 ? 14 : 15,
    fontFamily: "JetBrainsMono-Regular",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  signUpButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    width: width * 0.7,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    borderWidth: 1.5,
    borderColor: COLORS.accent,
    position: 'relative',
    overflow: 'hidden',
  },
  signUpButtonPressed: {
    backgroundColor: COLORS.accent,
    borderColor: 'transparent',
  },
  signUpButtonText: {
    color: COLORS.accent,
    fontSize: width < 380 ? 16 : 17,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  signUpButtonTextPressed: {
    color: "#FFFFFF",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
    width: inputWidth,
    paddingHorizontal: 5,
  },
  termsText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: width < 380 ? 12 : 13,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
    flexShrink: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.accent,
    fontFamily: "Poppins-Medium",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: inputWidth,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    color: "#FFFFFF",
    fontSize: width < 380 ? 14 : 15,
    fontFamily: "JetBrainsMono-Regular",
  },
  icon: {
    paddingRight: 15,
    opacity: 0.8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  signInText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: width < 380 ? 14 : 15,
    fontFamily: "Poppins-Regular",
  },
  signInLink: {
    color: COLORS.accent,
    fontSize: width < 380 ? 14 : 15,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
});

export default styles;