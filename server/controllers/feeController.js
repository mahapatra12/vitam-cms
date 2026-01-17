const Fee = require('../models/Fee');

// Get Fees for a Student
exports.getMyFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.user._id }).sort({ dueDate: 1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay Fee (Mock Payment)
exports.payFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    if (fee.status === 'Paid') {
      return res.status(400).json({ message: 'Fee already paid' });
    }

    fee.status = 'Paid';
    fee.paymentDate = new Date();
    fee.transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    await fee.save();
    res.json({ message: 'Payment successful', fee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create Fee for Student (Seeding/Manual)
exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get All Fees
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student', 'name rollNumber');
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update Fee
exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Delete Fee
exports.deleteFee = async (req, res) => {
  try {
    await Fee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Fee record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
