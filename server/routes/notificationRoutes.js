const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// All notification routes are protected (Admin only)
router.use(protect);

router.route('/')
  .get(getNotifications);

router.get('/unread-count', getUnreadCount);

router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
