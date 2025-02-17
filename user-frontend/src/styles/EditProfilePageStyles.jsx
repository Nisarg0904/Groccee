import { StyleSheet } from "react-native";

// Dark theme color palette
const COLORS = {
  primary: "#7C3AED", // Vibrant purple
  background: {
    dark: "#121212",
    surface: "#1E1E1E",
    card: "#252525"
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#CCCCCC", // Lighter secondary text for better visibility
  },
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#9D5CFF"
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.dark,
  },
  header: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  headerText: {
    color: COLORS.text.primary,
    fontSize: 28, // Increased from 24
    fontWeight: "600",
    marginBottom: 20,
  },
  profilePictureContainer: {
    width: 100, // Increased from 90
    height: 100, // Increased from 90
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.background.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  editPhotoButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editPhotoText: {
    marginLeft: 6,
    color: "#FFFFFF",
    fontSize: 16, // Increased from 14
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    color: COLORS.text.primary,
    fontSize: 20, // Increased from 16
    fontWeight: "600",
    marginBottom: 16,
    marginTop: 24,
    letterSpacing: 0.5, // Added for better readability
  },
  dropdownContainer: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  pickerItem: {
    color: "#000000",
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  checkbox: {
    backgroundColor: COLORS.background.card,
    color: COLORS.text.secondary,
    paddingVertical: 12, // Increased from 10
    paddingHorizontal: 20, // Increased from 16
    borderRadius: 10,
    fontSize: 16, // Increased from 14
    overflow: "hidden",
    marginBottom: 8, // Added for better spacing
  },
  activeCheckbox: {
    backgroundColor: COLORS.primary,
    color: COLORS.text.primary,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 18, // Increased from 16
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  updateButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 18, // Increased from 16
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 32,
    marginBottom: 24,
  },
  updateButtonText: {
    color: COLORS.text.primary,
    fontSize: 18, // Increased from 16
    fontWeight: "600",
    marginLeft: 8,
    letterSpacing: 0.5, // Added for better readability
  },
});