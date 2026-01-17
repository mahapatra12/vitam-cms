const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Protected route - only logged in users can use the AI
// You might want to rate limit this specifically in the future
router.post('/chat', protect, aiController.chatWithAI);

module.exports = router;
