const AuditLog = require('../models/AuditLog');

class AuditService {
  /**
   * Log a system action
   * @param {string} userId - User ID performing the action
   * @param {string} action - Action name (e.g., 'LOGIN', 'UPDATE_PROFILE')
   * @param {Object} details - Additional details about the action
   * @param {Object} req - Express request object (optional, to capture IP/UserAgent)
   */
  async log(userId, action, details = {}, req = null) {
    try {
      const logEntry = {
        user: userId,
        action,
        details
      };

      if (req) {
        logEntry.ipAddress = req.ip || req.connection.remoteAddress;
        logEntry.userAgent = req.headers['user-agent'];
      }

      await AuditLog.create(logEntry);
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error to avoid blocking the main operation
    }
  }

  /**
   * Get audit logs with pagination and filtering
   */
  async getLogs(filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.userId) query.user = filters.userId;
    if (filters.action) query.action = filters.action;
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      };
    }

    const logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments(query);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = new AuditService();
