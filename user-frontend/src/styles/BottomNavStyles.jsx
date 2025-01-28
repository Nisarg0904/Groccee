import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "black",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  centerButton: {
    backgroundColor: "#FF6347", // Turkey Red
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    color: "#F8F8FF", // Ghost White
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
  },
  activeLabel: {
    color: "#E52B50", // Turkey Red
    fontWeight: "bold",
  },
});
