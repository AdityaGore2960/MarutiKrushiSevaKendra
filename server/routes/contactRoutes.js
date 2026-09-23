const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  createMessage,
  getMessages,
  updateMessageStatus,
  replyToMessage,
  deleteMessage
} = require('../controllers/contactController');

// Public route for customers to submit form
router.post('/', createMessage);

// Protected admin routes
router.use(protect);
router.route('/').get(getMessages);

router.put('/:id/status', updateMessageStatus);
router.put('/:id/reply', replyToMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
