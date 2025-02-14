// screens/Shopping/CreateShoppingListPage.jsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../contexts/UserContext';
import { createShoppingList } from '../../services/shoppingApi';
import styles from '../../styles/CreateShoppingListStyles';

const CreateShoppingListPage = ({ visible, onClose, onSuccess }) => {
  const { token } = useContext(UserContext);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter a list name');
      return;
    }
  
    setLoading(true);
    try {
      const newList = await createShoppingList(name.trim(), token);
      setName('');
      setError(null);
      onSuccess(newList); // This should navigate to AddShoppingListItems with correct params
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create shopping list');
      console.error('Error creating list:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <View style={styles.header}>
                <Text style={styles.title}>Create New List</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="list" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setError(null);
                  }}
                  placeholder="Enter list name"
                  placeholderTextColor="#999"
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleCreate}
                />
              </View>

              {error && <Text style={styles.error}>{error}</Text>}

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.createButton, !name.trim() && styles.createButtonDisabled]}
                  onPress={handleCreate}
                  disabled={loading || !name.trim()}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.createButtonText}>Create</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CreateShoppingListPage;