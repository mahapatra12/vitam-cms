const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'hod', 'faculty', 'student', 'alumni'],
    default: 'student'
  },
  
  // Department & Academic Info
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  rollNumber: { type: String, unique: true, sparse: true },
  year: { type: Number, min: 1, max: 4 }, // Academic year
  semester: { type: Number, min: 1, max: 8 },
  section: { type: String, default: 'A' },
  
  // Contact Information
  phoneNumber: { type: String, required: true }, // Required for SMS 2FA
  alternateEmail: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  // Personal Information
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: { type: String },
  profilePicture: { type: String }, // URL to profile picture
  
  // Parent/Guardian Information (for students)
  guardianName: { type: String },
  guardianPhone: { type: String },
  guardianEmail: { type: String },
  
  // Faculty-specific fields
  designation: { type: String }, // Professor, Associate Professor, etc.
  qualification: { type: String }, // Ph.D., M.Tech, etc.
  specialization: { type: String },
  experience: { type: Number }, // Years of experience
  joiningDate: { type: Date },
  
  // MFA Secrets & State
  twoFactorSecret: { type: Object }, // Authenticator App Secret
  twoFactorEnabled: { type: Boolean, default: false },
  
  // OTPs for verification
  smsOtp: { type: String },
  smsOtpExpires: { type: Date },
  emailOtp: { type: String },
  emailOtpExpires: { type: Date },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  
  // Preferences
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Virtual for account locked status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('User', userSchema);
