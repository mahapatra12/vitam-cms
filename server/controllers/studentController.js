const studentService = require('../services/studentService');

const getDashboard = async (req, res) => {
  try {
    const data = await studentService.getDashboardStats(req.user._id);
    res.json(data);
  } catch (error) {
    console.error('Student Dashboard Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboard
};
