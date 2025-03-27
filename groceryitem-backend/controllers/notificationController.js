// groceryitem-backend/controllers/notificationController.js

const { Op } = require('sequelize');
const Notification = require("../models/Notification");
const GroceryItem = require("../models/grocery_item");
const axios = require('axios');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [['timestamp', 'DESC']]
    });
    
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications', 
      error: error.message 
    });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { type, message, grocery_item_id } = req.body;
    const user_id = req.user.id;
    
    const notification = await Notification.create({
      user_id,
      type,
      message,
      grocery_item_id,
      timestamp: req.body.timestamp || new Date(),
      read: false
    });
    
    res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ 
      message: 'Error creating notification', 
      error: error.message 
    });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId
      }
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ 
      message: 'Error marking notification as read', 
      error: error.message 
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    
    const notification = await Notification.findOne({
      where: {
        id: notificationId,
        user_id: userId
      }
    });
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    await notification.destroy();
    
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ 
      message: 'Error deleting notification', 
      error: error.message 
    });
  }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.update(
      { read: true },
      { where: { user_id: userId, read: false } }
    );
    
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ 
      message: 'Error marking all notifications as read', 
      error: error.message 
    });
  }
};

// Delete all notifications for a user
exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await Notification.destroy({ where: { user_id: userId } });
    
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    res.status(500).json({ 
      message: 'Error clearing all notifications', 
      error: error.message 
    });
  }
};

// Check for expiring grocery items and create notifications
exports.checkExpiringItems = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the current date
    const currentDate = new Date();
    
    // Calculate date 2 days from now
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(currentDate.getDate() + 2);
    
    // Format dates for SQL query
    const today = currentDate.toISOString().split('T')[0];
    const twoDaysLater = twoDaysFromNow.toISOString().split('T')[0];
    
    // Find grocery items that are expiring within 2 days or already expired
    const expiringItems = await GroceryItem.findAll({
      where: {
        user_id: userId,
        expiry_date: {
          [Op.and]: {
            [Op.not]: null,
            [Op.lte]: twoDaysLater
          }
        },
        // Consider fresh or active status items
        status: {
          [Op.in]: ['fresh', 'active', 'expiring']
        },
        available_quantity: {
          [Op.gt]: 0 // Only items that are still available
        }
      }
    });
    
    // Create notifications for each expiring item
    const createdNotifications = [];
    
    for (const item of expiringItems) {
      // Check if a notification already exists for this item
      const existingNotification = await Notification.findOne({
        where: {
          user_id: userId,
          grocery_item_id: item.id,
          type: 'expiry',
          // Only check for notifications created in the last 24 hours
          timestamp: {
            [Op.gte]: new Date(currentDate - 24 * 60 * 60 * 1000)
          }
        }
      });
      
      // Skip if notification already exists
      if (existingNotification) continue;
      
      // Calculate days until expiry
      const expiryDate = new Date(item.expiry_date);
      const diffTime = expiryDate - currentDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let message = '';
      
      if (diffDays < 0) {
        message = `${item.name} has expired!`;
      } else if (diffDays === 0) {
        message = `${item.name} expires today!`;
      } else {
        message = `${item.name} expires in ${diffDays} day${diffDays > 1 ? 's' : ''}.`;
      }
      
      // Create notification
      const notification = await Notification.create({
        user_id: userId,
        type: 'expiry',
        message,
        grocery_item_id: item.id,
        read: false
      });
      
      // Also update the status of expiring items if needed
      if (diffDays <= 2 && diffDays >= 0 && item.status !== 'expiring') {
        item.status = 'expiring';
        await item.save();
      } else if (diffDays < 0 && item.status !== 'expired') {
        item.status = 'expired';
        await item.save();
      }
      
      createdNotifications.push(notification);
    }
    
    res.status(200).json({
      message: `Created ${createdNotifications.length} expiry notifications`,
      notifications: createdNotifications
    });
    
  } catch (error) {
    console.error('Error checking expiring items:', error);
    res.status(500).json({ 
      message: 'Error checking expiring items', 
      error: error.message 
    });
  }
};

// Check user shopping habits and create notifications if needed
exports.checkShoppingReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const token = req.header("Authorization");
    
    // Get user profile from user-backend service
    try {
      const userResponse = await axios.get(`${process.env.USER_BACKEND_URL}/api/users/profile`, {
        headers: {
          Authorization: token
        }
      });
      
      const userProfile = userResponse.data;
      
      if (!userProfile || !userProfile.shoppingActivity) {
        return res.status(200).json({
          message: 'No shopping habits found for user',
          created: false
        });
      }
      
      // Parse shoppingActivity (assuming it contains shopping frequency info)
      const shoppingInfo = userProfile.shoppingActivity;
      
      // Find latest grocery item purchase to determine last shopping date
      const latestPurchase = await GroceryItem.findOne({
        where: { user_id: userId },
        order: [['purchased_date', 'DESC']]
      });
      
      if (!latestPurchase) {
        return res.status(200).json({
          message: 'No previous purchases found to determine shopping frequency',
          created: false
        });
      }
      
      const lastShoppingDate = new Date(latestPurchase.purchased_date);
      const currentDate = new Date();
      
      // Calculate shopping frequency in days based on user profile
      let shoppingFrequencyDays = 7; // Default weekly
      
      if (shoppingInfo === 'daily') {
        shoppingFrequencyDays = 1;
      } else if (shoppingInfo === 'twice-weekly') {
        shoppingFrequencyDays = 3;
      } else if (shoppingInfo === 'weekly') {
        shoppingFrequencyDays = 7;
      } else if (shoppingInfo === 'bi-weekly') {
        shoppingFrequencyDays = 14;
      } else if (shoppingInfo === 'monthly') {
        shoppingFrequencyDays = 30;
      }
      
      const diffTime = currentDate - lastShoppingDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= shoppingFrequencyDays) {
        // Check if a notification was already created today
        const existingNotification = await Notification.findOne({
          where: {
            user_id: userId,
            type: 'shopping',
            timestamp: {
              [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        });
        
        if (!existingNotification) {
          // Create shopping reminder notification
          const notification = await Notification.create({
            user_id: userId,
            type: 'shopping',
            message: 'It\'s time to go shopping based on your usual habits!',
            read: false
          });
          
          return res.status(201).json({
            message: 'Shopping reminder created',
            notification,
            created: true
          });
        } else {
          return res.status(200).json({
            message: 'Shopping reminder already exists for today',
            created: false
          });
        }
      }
      
      return res.status(200).json({
        message: 'No shopping reminder needed at this time',
        created: false
      });
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({
        message: 'Error fetching user profile',
        error: error.message
      });
    }
    
  } catch (error) {
    console.error('Error checking shopping reminders:', error);
    res.status(500).json({ 
      message: 'Error checking shopping reminders', 
      error: error.message 
    });
  }
};

module.exports = exports;