const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Faculty
  
  // File information
  fileUrl: { type: String, required: true }, // Path or URL to file
  fileName: { type: String, required: true },
  fileSize: { type: Number }, // in bytes
  fileType: { 
    type: String, 
    enum: ['PDF', 'DOC', 'DOCX', 'PPT', 'PPTX', 'XLS', 'XLSX', 'ZIP', 'Other'],
    default: 'PDF'
  },
  
  // Categorization
  category: { 
    type: String, 
    enum: ['Notes', 'Assignment', 'Previous Papers', 'Reference Material', 'Syllabus', 'Other'],
    default: 'Notes'
  },
  
  // Access control
  semester: { type: Number, required: true, min: 1, max: 8 },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  
  // Metadata
  downloads: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

studyMaterialSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
