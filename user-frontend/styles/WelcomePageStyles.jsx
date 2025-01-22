import { StyleSheet, Dimensions } from "react-native";

export const COLORS = {
  primary: "#4f6e71", // Steel Blue Gray
  secondary: "#3f6a54", // Forest Green
  tertiary: "#e4a31e", // Golden Yellow
  accent: "#1d2f23", // Dark Forest Green
  white: "#FFFFFF",
  lightText: "rgba(255, 255, 255, 0.9)",
  mediumText: "rgba(255, 255, 255, 0.7)",
  googleButtonColor: "#DB4437", // Google Red
  appleButtonColor: "#000000", // Apple Black
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.accent,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    
    
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.lightText,
    marginTop: 5,
    textAlign: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.lightText,
    textAlign: "center",
    lineHeight: 24,
  },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: COLORS.mediumText,
    marginVertical: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  smallSignInButton: {
    shadowColor: COLORS.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: COLORS.tertiary,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  smallSignUpButton: {
    shadowColor: COLORS.tertiary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: COLORS.secondary,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 50,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.white,
    marginBottom: 30,
  },
  signInText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "700",
  },
  signUpText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 20,
  },
  googleButton: {
    backgroundColor: COLORS.googleButtonColor,
    borderRadius: 25,
    width: width * 0.35,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  appleButton: {
    backgroundColor: COLORS.appleButtonColor,
    borderRadius: 25,
    width: width * 0.35,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  socialIcon: {
    fontSize: 18,
    color: COLORS.white,
  },
  socialText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 10,
  },
  orText: {
    fontSize: 16,
    color: COLORS.lightText,
    fontWeight: "600",
    marginHorizontal: 15,
  },
  termsText: {
    fontSize: 14,
    color: COLORS.lightText,
    textAlign: "center",
    marginTop: 20,
  },
  termsLink: {
    color: COLORS.tertiary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

export default styles;
