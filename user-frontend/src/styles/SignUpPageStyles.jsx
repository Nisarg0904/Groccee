import { StyleSheet } from "react-native";
import { COLORS } from "./WelcomePageStyles";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
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
    paddingHorizontal: 18,
    marginBottom: 20,
    borderRadius: 12,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "JetBrainsMono-Regular",
    backgroundColor: "transparent",
  },
  signUpButton: {
    backgroundColor: COLORS.turkeyRed,
    paddingVertical: 16,
    width: "100%",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 30,
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  termsText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  termsLink: {
    color: COLORS.turkeyRed,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "JetBrainsMono-Regular",
  },
  icon: {
    paddingRight: 15,
  },
});

export default styles;
