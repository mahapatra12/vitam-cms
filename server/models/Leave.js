const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Faculty/Student
  applicantRole: { type: String, enum: ['faculty', 'student'], required: true },
  
  // Leave details
  leaveType: { 
    type: String, 
    enum: ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Medical Leave', 'Other'],
    required: true 
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  
  // Supporting documents
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  
  // Approval workflow
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // HOD/Admin
  approvalDate: { type: Date },
  approverComments: { type: String },
  
  // Metadata
  numberOfDays: { type: Number },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate number of days before saving
leaveSchema.pre('save', function(next) {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Leave', leaveSchema);
