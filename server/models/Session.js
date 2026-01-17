const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "2024-2025"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  currentSemester: { type: Number, default: 1, min: 1, max: 2 }, // 1 for odd, 2 for even
  isActive: { type: Boolean, default: false },
  academicYear: { type: String, required: true }, // e.g., "2024"
  
  // Important dates
  importantDates: [{
    event: { type: String, required: true }, // e.g., "Mid-term Exams", "Registration"
    date: { type: Date, required: true },
    description: { type: String }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure only one active session at a time
sessionSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('Session').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
