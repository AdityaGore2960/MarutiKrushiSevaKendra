const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }

    const admin = await User.findById(decoded.id);

    if (!admin || admin.role !== 'ADMIN') {
      return res.status(401).json({ success: false, message: 'Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token is invalid or expired.' });
  }
};

module.exports = { protect };
