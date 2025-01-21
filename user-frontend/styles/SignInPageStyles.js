import { StyleSheet } from "react-native";

export const COLORS = {
  primary: "#4f6e71",
  secondary: "#3f6a54",
  accent: "#1d2f23",
  white: "#FFFFFF",
  lightText: "rgba(255, 255, 255, 0.9)",
  mediumText: "rgba(255, 255, 255, 0.7)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.white,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 14,
  },
  signInButton: {
    backgroundColor: "#ffb703",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    width: "80%",
    marginTop: 20,
    elevation: 4, 
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpText: {
    color: COLORS.lightText,
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  signUpLink: {
    color: "#DB4437",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default styles;
