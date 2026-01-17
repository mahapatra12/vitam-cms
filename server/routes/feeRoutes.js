const express = require('express');
const router = express.Router();
const { 
  getMyFees, payFee, createFee,
  getAllFees, updateFee, deleteFee 
} = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-fees', protect, getMyFees);
router.post('/pay/:id', protect, payFee);

// Admin Routes
router.post('/create', protect, createFee);
router.get('/', protect, getAllFees);
router.put('/:id', protect, updateFee);
router.delete('/:id', protect, deleteFee);

module.exports = router;
