const adminService = require('../services/adminService');
const auditService = require('../services/auditService');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers(req.query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await adminService.updateUserRole(userId, role);
    await auditService.log(req.user._id, 'UPDATE_USER_ROLE', { targetUser: userId, newRole: role }, req);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error: error.message });
  }
};

const getSystemLogs = async (req, res) => {
  try {
    const logs = await adminService.getSystemLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  getSystemLogs
};
