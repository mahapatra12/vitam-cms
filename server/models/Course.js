const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  year: { type: Number, required: true, min: 1, max: 4 },
  section: { type: String, default: 'A' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  
  // Faculty assignment
  assignedFaculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Course details
  credits: { type: Number, required: true, min: 1, max: 6 },
  maxStudents: { type: Number, default: 60 },
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Skill Mapping (New for AI Engine)
  skills: [{ type: String }], // e.g., ["Python", "Data Structures", "Algorithms"]
  
  // Schedule
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    startTime: String,
    endTime: String,
    room: String
  }],
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);
