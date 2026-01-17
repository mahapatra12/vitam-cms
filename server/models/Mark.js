const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  examType: { type: String, enum: ['Mid-Term', 'End-Term', 'Assignment'], required: true },
  marksObtained: { type: Number, required: true },
  maxMarks: { type: Number, required: true },
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mark', markSchema);
