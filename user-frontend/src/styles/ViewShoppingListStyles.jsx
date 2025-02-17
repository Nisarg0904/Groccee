import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContainer: {
      padding: 16,
      flexGrow: 1,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      padding: 16,
      borderRadius: 8,
      marginBottom: 12,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '500',
      color: '#000',
    },
    itemDetails: {
      fontSize: 14,
      color: '#666',
      marginTop: 4,
    },
    checkButton: {
      padding: 4,
    },
    emptyText: {
      textAlign: 'center',
      color: '#666',
      marginTop: 24,
      fontSize: 16,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    error: {
      color: '#FF3B30',
      textAlign: 'center',
      marginBottom: 12,
      fontSize: 14,
    },
    retryButton: {
      padding: 8,
    },
    retryText: {
      color: '#FF4141',
      fontSize: 16,
    },
    leftAction: {
      width: 80,
      height: '92%',
      marginBottom: 12,
      justifyContent: 'center',
    },
    rightAction: {
      width: 80,
      height: '92%',
      marginBottom: 12,
      justifyContent: 'center',
    },
    editButton: {
      flex: 1,
      backgroundColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    deleteButton: {
      flex: 1,
      backgroundColor: '#FF4141',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    },
    actionText: {
      color: 'white',
      fontSize: 12,
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      width: '80%',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalInput: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      fontSize: 16,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#ddd',
    },
    saveButton: {
      backgroundColor: '#FF4141',
    },
    modalButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
  });

export default styles;