import { StyleSheet, Dimensions, Platform } from "react-native";
import Constants from "expo-constants";
import { COLORS } from "./WelcomePageStyles";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary, // consistent dark background
    // Use paddingTop to avoid the notch on Android devices
    paddingTop: Platform.OS === "android" ? Constants.statusBarHeight + 20 : 40,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1, // ensures content expands properly
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.white,
  },
  input: {
    height: 50,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: COLORS.black,
    color: COLORS.white,
  },
  dateButton: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  expiryDateButton: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  expiryDateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  suggestionsContainer: {
    backgroundColor: COLORS.black,
    width: "100%",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5, // for Android shadow
    zIndex: 100,
    maxHeight: 150,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  suggestionItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  suggestionItem: {
    padding: 10,
    fontSize: 16,
    color: COLORS.white,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: COLORS.white,
  },
  picker: {
    backgroundColor: COLORS.black,
    color: COLORS.white,
    marginBottom: 15,
  },
  submitButton: {
    height: 50,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  datePicker: {
    backgroundColor: COLORS.black,
  },
  // Style for the animated success overlay.
  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 200,
  },
  successText: {
    marginTop: 15,
    fontSize: 18,
    color: COLORS.white,
    fontWeight: "bold",
  },
  disabledInput: {
  backgroundColor: '#333',  // Dark background
  color: '#fff',           // White text color
  padding: 12,
  borderRadius: 8,
  marginBottom: 16,
  fontSize: 16,
  opacity: 0.8,            // Slightly dimmed to indicate disabled state
},
});

export default styles;