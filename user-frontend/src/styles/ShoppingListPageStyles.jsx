import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8F8FF", // Ghost white
    marginBottom: 30,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#1E90FF", // Dodger blue
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#F8F8FF", // Ghost white
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "transparent",
    padding: 10,
  },
  backButtonText: {
    color: "#F8F8FF", // Ghost white
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    width: "100%",
    marginTop: 10,
  },
  listItem: {
    backgroundColor: "#333333", // Dark gray background for items
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white", // White text for contrast
  },
  listDate: {
    fontSize: 14,
    color: "#BBBBBB", // Light gray for secondary text
    marginTop: 5,
  },
});

export default styles;
