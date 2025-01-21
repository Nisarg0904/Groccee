import { StyleSheet } from "react-native";
import { COLORS } from "./WelcomePageStyles"; 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d2f23", // Forest Green
  },
  // gradient: {
  //   flex: 1,
  // },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.lightText,
    padding: 15,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: COLORS.white,
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightText,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  passwordInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
  },
  passwordHint: {
    color: COLORS.white,
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: COLORS.tertiary,
    paddingVertical: 12, // Reduced size
    width: "80%", // Smaller button width
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  signUpButtonText: {
    color: COLORS.accent,
    fontSize: 16, // Smaller text size
    fontWeight: "bold",
  },
  signInRedirectText: {
    color: "red", // Changed to red
    margin: 10,
    fontSize: 14,
  },
});

export default styles;
