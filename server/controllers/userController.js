const User = require('../models/User');
const upload = require('../middleware/upload');

/**
 * Upload profile picture
 */
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get file URL (S3 or local)
    const profilePictureUrl = req.file.location || `/uploads/${req.file.filename}`;

    // Update user profile
    user.profilePicture = profilePictureUrl;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      profilePictureUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete profile picture
 */
exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = null;
    await user.save();

    res.json({ message: 'Profile picture removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -twoFactorSecret -smsOtp -emailOtp')
      .populate('department', 'name code');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
