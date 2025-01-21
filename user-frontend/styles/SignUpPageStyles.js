import { StyleSheet } from "react-native";
import { COLORS } from "./WelcomePageStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 0,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: COLORS.white,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: COLORS.tertiary,
    paddingVertical: 14,
    width: "80%",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  signInButtonText: {
    color: COLORS.accent,
    fontSize: 18,
    fontWeight: "600",
  },
  signUpText: {
    marginTop: 20,
    fontSize: 16,
    color: COLORS.lightText,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default styles;
