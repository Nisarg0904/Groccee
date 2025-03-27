// screens/Notifications/NotificationsPage.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
  Platform
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { UserContext } from '../../contexts/UserContext';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  clearAllNotifications,
  checkExpiringItems,
  checkShoppingReminders,
  setNotificationAuthToken
} from '../../services/NotificationApi';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Make sure to install this package

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(UserContext);
  const [isProcessing, setIsProcessing] = useState(false); // State to track button operations

  // Setup auth token and fetch notifications on component mount
  useEffect(() => {
    const setupAndFetch = async () => {
      try {
        if (token) {
          // Set auth token for notification requests
          setNotificationAuthToken(token);
          
          // Check for new notifications
          await checkForNewNotifications();
          
          // Fetch notifications
          await fetchNotifications();
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
        showToast('Failed to load notifications. Pull down to retry.');
      } finally {
        setLoading(false);
      }
    };

    setupAndFetch();
  }, [token]);

  // Helper function to show toast messages
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS or other platforms
      Alert.alert('', message, [{ text: 'OK' }], { cancelable: true });
    }
  };

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    setRefreshing(true);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      showToast('Failed to fetch notifications. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Check for new notifications
  const checkForNewNotifications = async () => {
    try {
      // Check for expiring items
      await checkExpiringItems();
      
      // Check for shopping reminders
      await checkShoppingReminders();
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    await checkForNewNotifications();
    await fetchNotifications();
  };

  // Right swipe action: mark notification as read
  const handleMarkRead = async (notificationId) => {
    try {
      setIsProcessing(true);
      await markNotificationAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
      showToast('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      showToast('Failed to mark notification as read');
    } finally {
      setIsProcessing(false);
    }
  };

  // Left swipe action: delete the notification
  const handleDeleteNotification = async (notificationId) => {
    try {
      setIsProcessing(true);
      await deleteNotification(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      showToast('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      showToast('Failed to delete notification');
    } finally {
      setIsProcessing(false);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    // If no unread notifications, don't do anything
    if (!notifications.some(notification => !notification.read)) {
      showToast('No unread notifications');
      return;
    }

    // Confirm action
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await markAllNotificationsAsRead();
              setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, read: true }))
              );
              showToast('All notifications marked as read');
            } catch (error) {
              console.error('Error marking all notifications as read:', error);
              showToast('Failed to mark all notifications as read');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  // Clear all notifications
  const handleClearAll = async () => {
    // If no notifications, don't do anything
    if (notifications.length === 0) {
      showToast('No notifications to clear');
      return;
    }

    // Confirm action
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to delete all notifications? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await clearAllNotifications();
              setNotifications([]);
              showToast('All notifications cleared');
            } catch (error) {
              console.error('Error clearing all notifications:', error);
              showToast('Failed to clear notifications. Please try again.');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  // Format the timestamp for display - improved with relative time
  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notificationDate = new Date(timestamp);
    
    // If same day, show time
    if (now.toDateString() === notificationDate.toDateString()) {
      return notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } 
    // If within last week, show day name
    else if (now - notificationDate < 7 * 24 * 60 * 60 * 1000) {
      return notificationDate.toLocaleDateString([], { weekday: 'short' }) + ' ' +
             notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    // Otherwise show date
    else {
      return notificationDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'expiry':
        return <Icon name="warning" size={24} color="#FFA000" />;
      case 'shopping':
        return <Icon name="shopping-cart" size={24} color="#2196F3" />;
      default:
        return <Icon name="notifications" size={24} color="#4CAF50" />;
    }
  };

  // Render the visible part of a notification row
  const renderItem = (data) => (
    <View
      style={[
        styles.notificationItem,
        data.item.read ? styles.notificationRead : styles.notificationUnread
      ]}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          {getNotificationIcon(data.item.type)}
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.notificationText}>{data.item.message}</Text>
          <Text style={styles.timestampText}>{formatTimestamp(data.item.timestamp)}</Text>
        </View>
      </View>
      {!data.item.read && <View style={styles.unreadIndicator} />}
    </View>
  );

  // Render the hidden row with swipe actions
  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.leftButton, data.item.read && styles.disabledButton]}
        onPress={() => {
          if (!data.item.read && !isProcessing) {
            handleMarkRead(data.item.id);
          }
        }}
        disabled={data.item.read || isProcessing}
      >
        <Icon name="done" size={24} color="#fff" />
        <Text style={styles.buttonText}>
          {data.item.read ? "Read" : "Mark Read"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rightButton}
        onPress={() => {
          if (!isProcessing) {
            handleDeleteNotification(data.item.id);
          }
        }}
        disabled={isProcessing}
      >
        <Icon name="delete" size={24} color="#fff" />
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[
              styles.headerButton, 
              (!notifications.some(n => !n.read) || isProcessing) && styles.disabledButton
            ]} 
            onPress={handleMarkAllRead}
            disabled={!notifications.some(n => !n.read) || isProcessing}
          >
            <Text style={styles.headerButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.headerButton, 
              styles.clearAllButton, 
              (notifications.length === 0 || isProcessing) && styles.disabledButton
            ]} 
            onPress={handleClearAll}
            disabled={notifications.length === 0 || isProcessing}
          >
            <Text style={styles.headerButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {notifications.length > 0 ? (
        <SwipeListView
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={75}
          rightOpenValue={-75}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="notifications-off" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No notifications to display</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f8f9fa"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333"
  },
  headerButtons: {
    flexDirection: "row",
    marginLeft: 'auto'
  },
  headerButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
    elevation: 1
  },
  clearAllButton: {
    backgroundColor: "#dc3545"
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  messageContainer: {
    flex: 1,
  },
  notificationUnread: {
    backgroundColor: "#e8f0fe",
    borderLeftWidth: 3,
    borderLeftColor: "#007BFF"
  },
  notificationRead: {
    backgroundColor: "#fff"
  },
  notificationText: {
    fontSize: 16,
    color: "#333"
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4
  },
  unreadIndicator: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007BFF'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: "#f8f9fa",
    flex: 1,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  leftButton: {
    width: 75,
    height: "100%",
    backgroundColor: "#007BFF", // Blue for marking as read
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  rightButton: {
    width: 75,
    height: "100%",
    backgroundColor: "#ff4136", // Red for delete
    alignItems: "center",
    justifyContent: "center",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  disabledButton: {
    opacity: 0.5
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 4
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
    marginBottom: 24
  },
  refreshButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default NotificationsPage;