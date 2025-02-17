import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const FullDetailsModal = ({ visible, onClose, onSubmit, itemName, prePopulatedFields }) => {
  const [unit, setUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showExpiryPicker, setShowExpiryPicker] = useState(false);
  const [category, setCategory] = useState('');

  // Set today's date as default purchased date when modal opens
  useEffect(() => {
    if (visible) {
      if (prePopulatedFields) {
        setUnit(prePopulatedFields.unit || '');
        setQuantity(prePopulatedFields.quantity || '');
      } else {
        setUnit('');
        setQuantity('');
      }
      setPrice('');
      setCategory('');
      // Set expiry date to tomorrow by default
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setExpiryDate(tomorrow);
    }
  }, [visible, prePopulatedFields]);
  
  const handleSubmit = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
    
    const selectedExpiryDate = new Date(expiryDate);
    selectedExpiryDate.setHours(0, 0, 0, 0);

    if (!unit || !quantity || !price || !category) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Check if expiry date is in the future
    if (selectedExpiryDate <= today) {
      Alert.alert('Error', 'Expiry date must be a future date');
      return;
    }

    onSubmit({
      unit,
      quantity,
      price,
      expiryDate: expiryDate.toISOString().split('T')[0],
      purchasedDate: new Date().toISOString().split('T')[0], // Today's date
      category,
    });
  };

  const onExpiryDateChange = (event, selectedDate) => {
    setShowExpiryPicker(false);
    if (selectedDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);

      // If selected date is today or in the past, set it to tomorrow
      if (selected <= today) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setExpiryDate(tomorrow);
        Alert.alert('Invalid Date', 'Expiry date must be a future date');
      } else {
        setExpiryDate(selectedDate);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Complete Details for {itemName}</Text>
          
          <TextInput
            style={styles.modalInput}
            placeholder="Category (e.g., Dairy, Meat, Vegetables)"
            value={category}
            onChangeText={setCategory}
          />

          {!prePopulatedFields && (
            <>
              <TextInput
                style={styles.modalInput}
                placeholder="Unit (e.g., kg, pcs)"
                value={unit}
                onChangeText={setUnit}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </>
          )}
          
          <TextInput
            style={styles.modalInput}
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          
          {/* Today's date as purchase date */}
          <View style={styles.dateDisplay}>
            <Text style={styles.dateDisplayText}>
              Purchase Date: {new Date().toLocaleDateString()}
            </Text>
          </View>

          {/* Expiry date picker */}
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowExpiryPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Expiry Date: {expiryDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showExpiryPicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              minimumDate={new Date()} // Set minimum date to today
              onChange={onExpiryDateChange}
            />
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.saveButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

  const styles = StyleSheet.create({
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

  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dateDisplay: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  dateDisplayText: {
    fontSize: 16,
    color: '#333',
  },
  });
  
  export default FullDetailsModal;