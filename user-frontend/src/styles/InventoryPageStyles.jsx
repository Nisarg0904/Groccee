import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
    color: '#666666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  sortButton: {
    padding: 8,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    // padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Important to keep the badge within bounds
    flexDirection: 'row', // Enable horizontal layout for badge
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: 8,
    color: '#007AFF',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 8,
    width: 20,
    color: '#666666',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#F5F5F5',
    padding: 16,
    color: '#000000',
  },
  emptyList: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666666',
  },
  actionButton: {
    width: 75,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Makes modal appear from bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  quantityControls: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 12,
  backgroundColor: '#F5F5F5',
  borderRadius: 8,
  padding: 8,
},
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quantityTextContainer: {
    paddingHorizontal: 30,
    minWidth: 120,
    alignItems: 'center',
  },
  quantityButtonDisabled: {
  backgroundColor: '#B0B0B0',
},
  quantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  datePickerButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dateLabel: {
    fontSize: 16,
    color: '#666666',
    marginLeft: 12,
    marginRight: 8,
  },
  dateValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#666666',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  menuContainer: {
  backgroundColor: '#FFFFFF',
  borderRadius: 14,
  padding: 8,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},
menuOption: {
  padding: 12,
},
menuOptionContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
menuOptionText: {
  fontSize: 17,
  marginLeft: 12,
  color: '#000000',
},
menuOptionTextDelete: {
  color: '#FF3B30', // iOS red color
},
statusContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
  padding: 10,
  backgroundColor: '#F5F5F5',
  borderRadius: 8,
},
statusLabel: {
  fontSize: 16,
  marginRight: 10,
  color: '#666666',
},
statusBadge: {
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 12,
},
statusText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 12,
},
modalSection: {
  backgroundColor: '#F8F9FA',
  borderRadius: 12,
  padding: 16,
  marginBottom: 16,
},
filterBar: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',  // Light green background for active state
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
  },
  filterTextActive: {
    color: '#4CAF50',  // Green text for active state
    fontWeight: '500',
  },
  itemCardUsed: {
    // Extend your existing itemCard styles
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    flexDirection: 'row',
  },
  
  
 usedBadge: {
    width: 6, // Made slightly wider for visibility
    backgroundColor: '#FF3B30',
  },

  itemContent: {
    flex: 1,
    padding: 16, // Moved padding from itemCard to here
  },
});

export default styles;