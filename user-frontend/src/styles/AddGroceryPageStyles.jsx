import { StyleSheet } from "react-native";

const Colors = {
  background: "#000000",
  text: "#F8F8FF",      // Ghost White
  primary: "#FF6347",  // Turkey Red variation 2
  accent: "#228B22",   // Deep Forest Green
  inputBg: "#1A1A1A",
  placeholder: "#666666"
};

const styles = StyleSheet.create({
  // Top-level container that fills the screen and sets background
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Use this in `contentContainerStyle` to add padding & prevent cutting the button
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for button
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginVertical: 20,
    textAlign: "center",
    marginHorizontal: 8,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: Colors.text,
    fontSize: 16,
    marginHorizontal: 8,
  },
  dateButton: {
    backgroundColor: Colors.inputBg,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  dateText: {
    color: Colors.text,
    fontSize: 16,
  },
  // If you want a container for the button, you'd do it here.
  // But we can just keep the button inside the ScrollView.
  submitButtonContainer: {
    padding: 16,
    backgroundColor: Colors.background,
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
    marginBottom: 16,
  },
  submitText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    marginBottom: 4,
    marginHorizontal: 8,
  },
  required: {
    color: Colors.primary,
    fontSize: 14,
    marginLeft: 4,
  },
  inputNote: {
    color: Colors.placeholder,
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
});

export default styles;
