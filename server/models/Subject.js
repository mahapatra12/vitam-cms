const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  credits: { type: Number, required: true, min: 1, max: 6 },
  type: { 
    type: String, 
    enum: ['Theory', 'Practical', 'Theory + Practical'], 
    default: 'Theory' 
  },
  description: { type: String },
  syllabus: { type: String }, // URL or text
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
subjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Subject', subjectSchema);
