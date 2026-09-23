const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const {
  getSettings,
  updateSettings
} = require('../controllers/settingController');

router.route('/')
  .get(getSettings)
  .put(protect, upload.single('logo'), updateSettings);

module.exports = router;
