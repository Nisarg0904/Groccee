import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

function NotificationsPage() {
  // Dummy notifications data with a read flag for marking as read/unread
  const [notifications, setNotifications] = useState([
    { id: "1", message: "Milk expires in 2 days.", timestamp: "9:00 AM", read: false },
    { id: "2", message: "Eggs are nearing expiry.", timestamp: "8:45 AM", read: false },
    { id: "3", message: "Bakery items have been restocked.", timestamp: "8:30 AM", read: false }
  ]);

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Right swipe action: mark notification as read
  const handleMarkRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  // Left swipe action: delete the notification
  const handleDeleteNotification = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
  };

  // Handle pull-to-refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    // Uncomment and update the API call when ready:
    /*
    fetch('https://your-api.com/notifications')
      .then(response => response.json())
      .then(data => {
         setNotifications(data.notifications);
         setRefreshing(false);
      })
      .catch(error => {
         console.error(error);
         setRefreshing(false);
      });
    */
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // Handle infinite scroll to load more notifications
  const handleLoadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const currentCount = notifications.length;
      const moreNotifications = [
        {
          id: String(currentCount + 1),
          message: `New notification ${currentCount + 1}`,
          timestamp: "Just now",
          read: false
        },
        {
          id: String(currentCount + 2),
          message: `New notification ${currentCount + 2}`,
          timestamp: "Just now",
          read: false
        }
      ];
      setNotifications([...notifications, ...moreNotifications]);
      setLoadingMore(false);
    }, 2000);
  };

  // Render the visible part of a notification row (no tap action)
  const renderItem = (data) => (
    <View
      style={[
        styles.notificationItem,
        data.item.read ? styles.notificationRead : styles.notificationUnread
      ]}
    >
      <Text style={styles.notificationText}>{data.item.message}</Text>
      <Text style={styles.timestampText}>{data.item.timestamp}</Text>
    </View>
  );

  // Render the hidden row with two buttons:
  // Left side (revealed on right swipe): Mark as Read
  // Right side (revealed on left swipe): Delete
  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.leftButton, data.item.read && styles.disabledButton]}
        onPress={() => {
          if (!data.item.read) {
            handleMarkRead(data.item.id);
          }
        }}
      >
        <Text style={styles.buttonText}>
          {data.item.read ? "Read" : "Mark as Read"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rightButton}
        onPress={() => handleDeleteNotification(data.item.id)}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Title, Mark All Read, and Clear All buttons */}
      <View style={styles.header}>
        {/* <Text style={styles.title}>Notifications</Text> */}
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.headerButton} onPress={handleMarkAllRead}>
            <Text style={styles.headerButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.clearAllButton]} onPress={handleClearAll}>
            <Text style={styles.headerButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SwipeListView
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={75}      // Right swipe reveals left hidden button: Mark as Read
        rightOpenValue={-75}    // Left swipe reveals right hidden button: Delete
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loadingMore && <ActivityIndicator size="small" color="#000" style={styles.loadingIndicator} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
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
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 10
  },
  // Red background for clear all button
  clearAllButton: {
    backgroundColor: "#dc3545"
  },
  headerButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  notificationUnread: {
    backgroundColor: "#e8f0fe"
  },
  notificationRead: {
    backgroundColor: "#fff"
  },
  notificationText: {
    fontSize: 16,
    color: "#555"
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textAlign: "right"
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
    fontWeight: "bold"
  },
  loadingIndicator: {
    marginVertical: 10,
  }
});

export default NotificationsPage; 