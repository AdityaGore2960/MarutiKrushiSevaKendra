const Notification = require('../models/Notification');

// @desc    Get all notifications
// @route   GET /api/notifications
// @access  Private/Admin
const getNotifications = async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  res.json({ success: true, data: notifications });
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private/Admin
const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ isRead: false });
  res.json({ success: true, count });
};

// @desc    Mark a notification as read (or all)
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  if (req.params.id === 'all') {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    return res.json({ success: true, message: 'All notifications marked as read' });
  }

  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  res.json({ success: true, data: notification });
};

// @desc    Delete a notification (or all)
// @route   DELETE /api/notifications/:id
// @access  Private/Admin
const deleteNotification = async (req, res) => {
  if (req.params.id === 'all') {
    await Notification.deleteMany({});
    return res.json({ success: true, message: 'All notifications deleted' });
  }

  const notification = await Notification.findByIdAndDelete(req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  res.json({ success: true, message: 'Notification deleted' });
};

// Helper function to create notifications from other controllers
const createNotification = async ({ title, message, type, link }) => {
  try {
    await Notification.create({ title, message, type, link });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
  createNotification
};
