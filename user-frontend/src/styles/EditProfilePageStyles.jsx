import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    height: 200,
    backgroundColor: "linear-gradient(45deg, #4A235A, #1B264F)", // Gradient
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    color: "white",
    fontSize: 22,
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
  },
  profilePicture: {
    width: "100%",
    height: "100%",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  progressBar: {
    width: "80%",
    height: 10,
    backgroundColor: "#D3D3D3",
    borderRadius: 5,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#FF6347", // Turkey Red
  },
  progressText: {
    color: "white",
    marginTop: 5,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputCard: {
    backgroundColor: "#36454F", // Charcoal Gray
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  input: {
    color: "white",
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    backgroundColor: "#36454F",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: "#FF6347",
  },
  chipText: {
    color: "#D3D3D3",
    fontSize: 14,
  },
  activeChipText: {
    color: "white",
  },
  updateButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF6347",
    paddingVertical: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
