const mongoose = require('mongoose');

const timetableEntrySchema = new mongoose.Schema({
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true 
  },
  startTime: { type: String, required: true }, // e.g., "09:00"
  endTime: { type: String, required: true }, // e.g., "10:00"
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: String }, // e.g., "Room 301", "Lab A"
  type: { 
    type: String, 
    enum: ['Lecture', 'Lab', 'Tutorial'], 
    default: 'Lecture' 
  }
});

const timetableSchema = new mongoose.Schema({
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  section: { type: String, default: 'A' }, // For multiple sections
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  
  entries: [timetableEntrySchema],
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index to ensure unique timetable per department/semester/section/session
timetableSchema.index({ department: 1, semester: 1, section: 1, session: 1 }, { unique: true });

timetableSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Timetable', timetableSchema);
