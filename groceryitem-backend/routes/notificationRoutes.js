// groceryitem-backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticateToken = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all notifications for the authenticated user
router.get('/', notificationController.getNotifications);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark a notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

// Mark all notifications as read for the authenticated user
router.patch('/mark-all-read', notificationController.markAllAsRead);

// Delete all notifications for the authenticated user
router.delete('/clear-all', notificationController.clearAllNotifications);

// Check for expiring items and create notifications if needed
router.post('/check-expiring-items', notificationController.checkExpiringItems);

// Check user shopping habits and create notifications if needed
router.post('/check-shopping-reminders', notificationController.checkShoppingReminders);

module.exports = router;