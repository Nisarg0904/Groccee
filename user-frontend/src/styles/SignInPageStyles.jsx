import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "./WelcomePageStyles";

const { width } = Dimensions.get("window");
const inputWidth = width * 0.85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: width < 380 ? 40 : 60,
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
  signInButton: {
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
  signInButtonPressed: {
    backgroundColor: COLORS.accent,
    borderColor: 'transparent',
  },
  signInButtonText: {
    color: COLORS.accent,
    fontSize: width < 380 ? 16 : 17,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  signInButtonTextPressed: {
    color: "#FFFFFF",
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },
  signUpText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: width < 380 ? 14 : 15,
    fontFamily: "Poppins-Regular",
  },
  signUpLink: {
    color: COLORS.accent,
    fontSize: width < 380 ? 14 : 15,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
});

export default styles;
