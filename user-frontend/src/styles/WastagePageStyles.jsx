import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
    color: "#666666",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  filterBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: "#F2F2F2",
  },
  filterButtonActive: {
    backgroundColor: "#E8F5E9",
  },
  filterText: {
    fontSize: 14,
    color: "#666666",
  },
  filterTextActive: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  itemDetail: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  emptyList: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666666",
  },
  totalWastedContainer: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  totalWastedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
});

export default styles;
