import { StyleSheet } from "react-native";

export const COLORS = {
  black: "#000000",
  turkeyRed: "#B00005",
  white: "#DADBDD",
  lightText: "rgba(255, 255, 255, 0.9)",
  mediumText: "rgba(255, 255, 255, 0.7)",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.mediumText,
    fontFamily: "Poppins-Regular",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "JetBrainsMono-Regular",
    backgroundColor: "transparent",
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "JetBrainsMono-Regular",
    paddingVertical: 14,
  },
  icon: {
    marginLeft: 10,
  },
  signInButton: {
    backgroundColor: COLORS.turkeyRed,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  signInButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
  },
  signUpText: {
    color: COLORS.lightText,
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  signUpLink: {
    color: COLORS.turkeyRed,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default styles;
