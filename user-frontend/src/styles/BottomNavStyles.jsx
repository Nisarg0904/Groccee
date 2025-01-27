import { StyleSheet } from "react-nativescript";

export const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: "black",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    opacity: 0.7,
    transition: "all 0.3s",
  },
  activeNavItem: {
    opacity: 1,
  },
  centerButton: {
    backgroundColor: "#E52B50", // Turkey red
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -25,
    elevation: 4,
  },
  icon: {
    color: "#F8F8FF", // Ghost white
    fontSize: 20,
  },
  plusIcon: {
    color: "#F8F8FF", // Ghost white
    fontSize: 24,
  },
  label: {
    color: "#F8F8FF", // Ghost white
    fontSize: 12,
    marginTop: 4,
  },
});