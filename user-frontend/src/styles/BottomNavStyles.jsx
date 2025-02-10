// BottomNavStyles.js
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
// Adjust shape height based on your design
const SHAPE_HEIGHT = 280;

export const styles = StyleSheet.create({
  shapeWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: SHAPE_HEIGHT,
  },
  barImage: {
    position: "absolute",
    // If you want an exact replicate from your snippet:
    width: 761,
    height: SHAPE_HEIGHT,
    // For responsiveness, you could try:
    width: "100%",
    resizeMode: "cover",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#000",
  },
  barImageTop: {
    top: 0,
    left: 0,
  },
  barImageBottom: {
    top: SHAPE_HEIGHT,
    left: 0,
    transform: [{ rotate: "180deg" }],
  },

  navContainer: {
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

    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingVertical: 10,
  },
  centerButton: {
    backgroundColor: "#E52B50",
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

    // White border ring to give that extra space/outline
    borderWidth: 3.5,
    borderColor: "#F8F8FF",

    // (Optional) If you want space between the plus icon and the button edge:
    // padding: 5,
  },
  label: {
    color: "#F8F8FF",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
  },
  activeLabel: {
    color: "#E52B50",
    fontWeight: "bold",
  },
});
