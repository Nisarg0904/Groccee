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

const FullDetailsModal = ({ visible, onClose, onSubmit, itemName }) => {
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [purchasedDate, setPurchasedDate] = useState('');
    const [category, setCategory] = useState('');
  
    // Set today's date as default purchased date when modal opens
    useEffect(() => {
      if (visible) {
        const today = new Date().toISOString().split('T')[0];
        setPurchasedDate(today);
      }
    }, [visible]);
  
    const handleSubmit = () => {
      if (!unit || !quantity || !price || !expiryDate || !purchasedDate || !category) {
        Alert.alert('Error', 'All fields are required');
        return;
      }
  
      onSubmit({
        unit,
        quantity,
        price,
        expiryDate,
        purchasedDate,
        category,
      });
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
            
            <TextInput
              style={styles.modalInput}
              placeholder="Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Expiry Date (YYYY-MM-DD)"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
  
            <TextInput
              style={styles.modalInput}
              placeholder="Purchase Date (YYYY-MM-DD)"
              value={purchasedDate}
              onChangeText={setPurchasedDate}
            />
  
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
  });
  
  export default FullDetailsModal;