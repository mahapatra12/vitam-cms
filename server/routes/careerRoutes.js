const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/guidance', protect, careerController.generateCareerGuidance);

module.exports = router;
