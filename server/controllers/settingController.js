const Setting = require('../models/Setting');
const { cloudinary } = require('../config/cloudinary');

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  let settings = await Setting.findOne();
  
  if (!settings) {
    settings = await Setting.create({});
  }
  
  res.json({ success: true, data: settings });
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  let settings = await Setting.findOne();
  
  if (!settings) {
    settings = new Setting();
  }

  const {
    storeName,
    businessEmail,
    customerSupportPhone,
    businessAddress,
    shippingEnabled,
    flatShippingRate,
    freeShippingThreshold
  } = req.body;

  if (storeName) settings.storeName = storeName;
  if (businessEmail) settings.businessEmail = businessEmail;
  if (customerSupportPhone) settings.customerSupportPhone = customerSupportPhone;
  if (businessAddress) settings.businessAddress = businessAddress;
  
  if (shippingEnabled !== undefined) settings.shippingEnabled = shippingEnabled === 'true' || shippingEnabled === true;
  if (flatShippingRate !== undefined) settings.flatShippingRate = Number(flatShippingRate);
  if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = Number(freeShippingThreshold);

  if (req.file) {
    if (settings.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(settings.cloudinaryPublicId);
      } catch (err) {
        console.error('Failed to delete old logo from Cloudinary', err);
      }
    }
    try {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'marutikrushisevakendra/settings' });
      settings.storeLogoUrl = result.secure_url;
      settings.cloudinaryPublicId = result.public_id;
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Logo upload failed' });
    }
  }

  await settings.save();
  res.json({ success: true, data: settings, message: 'Settings updated successfully.' });
};

module.exports = { getSettings, updateSettings };
