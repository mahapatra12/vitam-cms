const express = require('express');
const router = express.Router();
const { 
  uploadProfilePicture, 
  deleteProfilePicture, 
  getProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);
router.delete('/profile-picture', deleteProfilePicture);

module.exports = router;
