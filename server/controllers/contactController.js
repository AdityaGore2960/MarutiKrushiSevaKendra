const Message = require('../models/Message');
const { createNotification } = require('./notificationController');
const nodemailer = require('nodemailer');

// Helper to send email securely via server-side
const sendEmailNotification = async (contactMessage) => {
  try {
    // If SMTP is not configured in .env, gracefully fail out
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Skipping email notification: SMTP credentials not found in .env');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Store Notifications" <${process.env.SMTP_USER}>`,
      to: 'contact@MarutiKrushiSevaKendra.in',
      subject: `New Contact Message from ${contactMessage.name}`,
      text: `
You have received a new contact message.

Name: ${contactMessage.name}
Mobile: ${contactMessage.mobile}
Email: ${contactMessage.email || 'N/A'}

Message:
${contactMessage.message}
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully.');
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
  }
};

// @desc    Create new contact message
// @route   POST /api/contact
// @access  Public
const createMessage = async (req, res) => {
  const { name, mobile, email, message, subject, category, orderId } = req.body;

  if (!name || !mobile || !message) {
    return res.status(400).json({ success: false, message: 'Name, mobile, and message are required.' });
  }

  // Validate lengths and formats
  if (name.trim().length > 100) {
    return res.status(400).json({ success: false, message: 'Name cannot exceed 100 characters.' });
  }
  if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
    return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit Indian mobile number.' });
  }
  if (email && email.trim().length > 0) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
  }
  if (message.trim().length > 2000) {
    return res.status(400).json({ success: false, message: 'Message cannot exceed 2000 characters.' });
  }

  const validCategories = ['General Inquiry', 'Order Support', 'Payment Issue', 'Product Inquiry', 'Complaint', 'Other'];

  const newMessage = await Message.create({
    name: name.trim(),
    mobile: mobile.trim(),
    email: email ? email.trim() : '',
    message: message.trim(),
    subject: subject ? subject.trim() : '',
    category: validCategories.includes(category) ? category : 'General Inquiry',
    orderId: orderId ? orderId.trim() : '',
    status: 'NEW',
  });

  // 1. Create Admin Notification
  await createNotification({
    title: 'New Contact Message',
    message: `${newMessage.name} sent a message.`,
    type: 'MESSAGE',
    link: '/admin/messages'
  });

  // 2. Fire and forget email notification
  sendEmailNotification(newMessage);

  res.status(201).json({ success: true, message: 'Your message has been sent successfully. We will contact you soon.' });
};

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private/Admin
const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json({ success: true, data: messages });
};

// @desc    Update message status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
const updateMessageStatus = async (req, res) => {
  const { status } = req.body;

  if (!['NEW', 'READ', 'REPLIED', 'RESOLVED'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }

  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  res.json({ success: true, data: message });
};

// @desc    Save admin reply to a message
// @route   PUT /api/contact/:id/reply
// @access  Private/Admin
const replyToMessage = async (req, res) => {
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({ success: false, message: 'Reply text is required.' });
  }

  const message = await Message.findByIdAndUpdate(
    req.params.id,
    {
      adminReply: reply.trim(),
      adminRepliedAt: new Date(),
      status: 'REPLIED',
    },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  res.json({ success: true, data: message });
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);

  if (!message) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  res.json({ success: true, message: 'Message deleted successfully.' });
};

module.exports = {
  createMessage,
  getMessages,
  updateMessageStatus,
  replyToMessage,
  deleteMessage
};
