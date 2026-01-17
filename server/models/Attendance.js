const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Faculty
});

// Compound index to prevent duplicate attendance for same student/course/date
attendanceSchema.index({ date: 1, course: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
