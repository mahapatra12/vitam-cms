const SystemSettings = require('../models/SystemSettings');
const AuditLog = require('../models/AuditLog');

// Helper: Create audit log
const createAuditLog = async (user, action, resourceType, resourceId, description, changes = null) => {
  try {
    await AuditLog.create({
      user: user._id,
      userEmail: user.email,
      userRole: user.role,
      action,
      resourceType,
      resourceId,
      description,
      changes,
      status: 'SUCCESS'
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

// Get system settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findById('system_settings')
      .populate('academicSettings.currentSession', 'name academicYear');
    
    // Create default settings if none exist
    if (!settings) {
      settings = await SystemSettings.create({ _id: 'system_settings' });
    }
    
    // Hide sensitive fields from non-admin users
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      settings = settings.toObject();
      delete settings.emailConfig;
      delete settings.smsConfig;
      delete settings.feeSettings.paymentGatewayKey;
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update system settings (Admin only)
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findById('system_settings');
    
    if (!settings) {
      settings = await SystemSettings.create({ _id: 'system_settings', ...req.body });
    } else {
      const oldData = { ...settings.toObject() };
      
      // Deep merge for nested objects
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key]) && req.body[key] !== null) {
          settings[key] = { ...settings[key], ...req.body[key] };
        } else {
          settings[key] = req.body[key];
        }
      });
      
      settings.updatedBy = req.user._id;
      await settings.save();
      
      await createAuditLog(
        req.user,
        'UPDATE',
        'SystemSettings',
        settings._id,
        `Updated system settings`,
        { old: oldData, new: settings.toObject() }
      );
    }
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update branding (Admin only)
exports.updateBranding = async (req, res) => {
  try {
    let settings = await SystemSettings.findById('system_settings');
    
    if (!settings) {
      settings = await SystemSettings.create({ _id: 'system_settings' });
    }
    
    const { instituteName, instituteShortName, logoUrl, faviconUrl, primaryColor, secondaryColor } = req.body;
    
    if (instituteName) settings.instituteName = instituteName;
    if (instituteShortName) settings.instituteShortName = instituteShortName;
    if (logoUrl) settings.logoUrl = logoUrl;
    if (faviconUrl) settings.faviconUrl = faviconUrl;
    if (primaryColor) settings.primaryColor = primaryColor;
    if (secondaryColor) settings.secondaryColor = secondaryColor;
    
    settings.updatedBy = req.user._id;
    await settings.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'SystemSettings',
      settings._id,
      `Updated branding settings`
    );
    
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update email config (Admin only)
exports.updateEmailConfig = async (req, res) => {
  try {
    let settings = await SystemSettings.findById('system_settings');
    
    if (!settings) {
      settings = await SystemSettings.create({ _id: 'system_settings' });
    }
    
    settings.emailConfig = { ...settings.emailConfig, ...req.body };
    settings.updatedBy = req.user._id;
    await settings.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'SystemSettings',
      settings._id,
      `Updated email configuration`
    );
    
    res.json({ message: 'Email configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update SMS config (Admin only)
exports.updateSmsConfig = async (req, res) => {
  try {
    let settings = await SystemSettings.findById('system_settings');
    
    if (!settings) {
      settings = await SystemSettings.create({ _id: 'system_settings' });
    }
    
    settings.smsConfig = { ...settings.smsConfig, ...req.body };
    settings.updatedBy = req.user._id;
    await settings.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'SystemSettings',
      settings._id,
      `Updated SMS configuration`
    );
    
    res.json({ message: 'SMS configuration updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle maintenance mode (Admin only)
exports.toggleMaintenanceMode = async (req, res) => {
  try {
    let settings = await SystemSettings.findById('system_settings');
    
    if (!settings) {
      settings = await SystemSettings.create({ _id: 'system_settings' });
    }
    
    settings.maintenanceMode = !settings.maintenanceMode;
    settings.maintenanceMessage = req.body.message || settings.maintenanceMessage;
    settings.updatedBy = req.user._id;
    await settings.save();
    
    await createAuditLog(
      req.user,
      'UPDATE',
      'SystemSettings',
      settings._id,
      `${settings.maintenanceMode ? 'Enabled' : 'Disabled'} maintenance mode`
    );
    
    res.json({ 
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;
