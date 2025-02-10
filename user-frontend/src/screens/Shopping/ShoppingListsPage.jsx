import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../../contexts/UserContext';
import { getAllShoppingLists } from '../../services/shoppingApi';
import { format, formatInTimeZone } from 'date-fns-tz';
import { parseISO } from 'date-fns';

const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Convert UTC to Toronto timezone and format
    const formatted = formatInTimeZone(
      parseISO(dateString),
      'America/Toronto',
      'MMM d, yyyy h:mm a'
    );
    return formatted;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};




const ShoppingListsPage = ({ navigation }) => {
  const { token, setToken } = useContext(UserContext);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchLists = async () => {
    if (!token) {
      console.log('No token available');
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching with token:', token); // Debugging
      const data = await getAllShoppingLists(token);
      setShoppingLists(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      if (err.message === 'Invalid Token') {
        // Handle invalid token
        setToken(null); // Clear invalid token
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to fetch shopping lists');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLists();
    }
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLists();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.listItem, item.status === 'Purchased' && styles.purchasedItem]}
      onPress={() => navigation.navigate('ShoppingListItems', { listId: item.shopping_list_id })}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.listName}>{item.name}</Text>
        <Text style={[styles.listStatus, item.status === 'Purchased' && styles.purchasedStatus]}>
          {item.status}
        </Text>
        <Text style={styles.dateText}>
          Created: {formatDate(item.createdAt)}
        </Text>
        {item.purchased_date && (
          <Text style={styles.purchaseDate}>
            Purchased: {formatDate(item.purchased_date)}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF4141" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateShoppingList')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.createButtonText}>Create New List</Text>
      </TouchableOpacity>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLists}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={shoppingLists}
          renderItem={renderItem}
          keyExtractor={(item) => item.shopping_list_id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No shopping lists found</Text>
          }
        />
      )}
    </View>
  );
};

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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4141',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  listItemContent: {
    flex: 1,
  },
  purchasedItem: {
    backgroundColor: '#f0f8f0',
  },
  listName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  listStatus: {
    fontSize: 14,
    color: '#666',
  },
  purchasedStatus: {
    color: '#4CAF50',
  },
  purchaseDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 24,
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
    marginTop: 8,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    padding: 8,
  },
  retryText: {
    color: '#FF4141',
    fontSize: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  purchaseDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

});

export default ShoppingListsPage;