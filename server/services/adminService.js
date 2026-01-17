const User = require('../models/User');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

class AdminService {
  async getDashboardStats() {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalDepartments = await Department.countDocuments();
    const pendingApprovals = await User.countDocuments({ isApproved: false }); // Assuming approval workflow

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');

    return {
      metrics: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        pendingLeaves: pendingApprovals
      },
      recentUsers
    };
  }

  async getAllUsers(filters = {}) {
    const query = {};
    if (filters.role) query.role = filters.role;
    if (filters.department) query.department = filters.department;
    
    return await User.find(query).select('-password -twoFactorSecret');
  }

  async updateUserRole(userId, role) {
    return await User.findByIdAndUpdate(userId, { role }, { new: true });
  }

  async getSystemLogs(limit = 50) {
    return await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

module.exports = new AdminService();
