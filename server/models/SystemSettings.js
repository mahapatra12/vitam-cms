const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  // Singleton pattern - only one document should exist
  _id: { type: String, default: 'system_settings' },
  
  // Branding
  instituteName: { type: String, default: 'VITAM College of Engineering' },
  instituteShortName: { type: String, default: 'VITAM' },
  logoUrl: { type: String },
  faviconUrl: { type: String },
  primaryColor: { type: String, default: '#3B82F6' },
  secondaryColor: { type: String, default: '#8B5CF6' },
  
  // Contact Information
  contactEmail: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  website: { type: String, default: 'https://vitam.edu.in' },
  
  // Email Configuration
  emailConfig: {
    smtpHost: { type: String },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String },
    smtpPassword: { type: String }, // Should be encrypted in production
    fromEmail: { type: String },
    fromName: { type: String, default: 'VITAM CMS' }
  },
  
  // SMS Configuration
  smsConfig: {
    provider: { type: String, enum: ['Twilio', 'AWS SNS', 'Other'], default: 'Twilio' },
    apiKey: { type: String }, // Should be encrypted in production
    apiSecret: { type: String }, // Should be encrypted in production
    senderId: { type: String }
  },
  
  // Academic Settings
  academicSettings: {
    currentSession: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
    attendancePercentageRequired: { type: Number, default: 75 },
    maxAbsencesAllowed: { type: Number, default: 10 },
    gradeSystem: { 
      type: String, 
      enum: ['10-point', 'Percentage', 'Letter'],
      default: '10-point'
    }
  },
  
  // Fee Settings
  feeSettings: {
    lateFeePercentage: { type: Number, default: 5 },
    paymentGatewayEnabled: { type: Boolean, default: false },
    paymentGatewayKey: { type: String }
  },
  
  // Security Settings
  securitySettings: {
    sessionTimeout: { type: Number, default: 30 }, // minutes
    maxLoginAttempts: { type: Number, default: 5 },
    passwordExpiryDays: { type: Number, default: 90 },
    require2FA: { type: Boolean, default: true }
  },
  
  // Maintenance
  maintenanceMode: { type: Boolean, default: false },
  maintenanceMessage: { type: String },
  
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

systemSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
