import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Darker shade for better contrast
    paddingBottom: 20,
  },
  header: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
    backgroundColor: "#1B264F", // Darker blue to match the theme
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  editPhotoButton: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  editPhotoText: {
    marginLeft: 4,
    color: "#E52B50",
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputCard: {
    backgroundColor: "#2C2C2C", // Dark grey for better contrast
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 12,
  },
  input: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: "#2C2C2C",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  picker: {
    color: "white",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 5,
  },
  checkbox: {
    backgroundColor: "#333333",
    color: "#D3D3D3",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 14,
    textAlign: "center",
  },
  activeCheckbox: {
    backgroundColor: "#E52B50",
    color: "white",
    fontWeight: "bold",
  },
  updateButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E52B50",
    paddingVertical: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
