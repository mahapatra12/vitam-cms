import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, GraduationCap, Building2, FileText,
  TrendingUp, Clock, UserPlus, AlertCircle, Shield
} from 'lucide-react';
import './AdminDashboardOverview.css';

const AdminDashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-error">
        <AlertCircle size={48} />
        <p>{error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  const metrics = stats?.metrics || {};
  const recentUsers = stats?.recentUsers || [];

  return (
    <div className="admin-dashboard-overview">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>
        <button className="btn-primary">
          <UserPlus size={20} />
          Create New User
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-grid">
        <MetricCard
          icon={<Users size={32} />}
          title="Total Students"
          value={metrics.totalStudents || 0}
          trend="+12% from last month"
          color="blue"
        />
        <MetricCard
          icon={<GraduationCap size={32} />}
          title="Total Faculty"
          value={metrics.totalFaculty || 0}
          trend="+5% from last month"
          color="purple"
        />
        <MetricCard
          icon={<Building2 size={32} />}
          title="Departments"
          value={metrics.totalDepartments || 0}
          trend="Active departments"
          color="green"
        />
        <MetricCard
          icon={<FileText size={32} />}
          title="Pending Approvals"
          value={metrics.pendingLeaves || 0}
          trend="Requires attention"
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Enrollment Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Enrollment Trends</h3>
            <select className="chart-filter">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <TrendingUp size={64} />
            <p>Enrollment chart will be displayed here</p>
            <small>Integration with Chart.js coming soon</small>
          </div>
        </div>

        {/* Fee Collection Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Fee Collection</h3>
            <select className="chart-filter">
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <TrendingUp size={64} />
            <p>Fee collection chart will be displayed here</p>
            <small>Integration with Chart.js coming soon</small>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="activity-header">
          <h3>Recent Users</h3>
          <a href="/admin/users">View All</a>
        </div>
        <div className="activity-list">
          {recentUsers.length > 0 ? (
            recentUsers.map((user) => (
              <div key={user._id} className="activity-item">
                <div className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                <div className="user-role">
                  <span className={`role-badge role-${user.role}`}>
                    {user.role}
                  </span>
                </div>
                <div className="user-date">
                  <Clock size={16} />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">No recent users</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <ActionButton
            icon={<UserPlus size={24} />}
            title="Add User"
            description="Create new student or faculty"
            onClick={() => {/* Navigate to user creation */}}
          />
          <ActionButton
            icon={<Building2 size={24} />}
            title="Manage Departments"
            description="Add or edit departments"
            onClick={() => {/* Navigate to departments */}}
          />
          <ActionButton
            icon={<FileText size={24} />}
            title="Create Announcement"
            description="Send global announcement"
            onClick={() => {/* Navigate to announcements */}}
          />
          <ActionButton
            icon={<GraduationCap size={24} />}
            title="Manage Courses"
            description="Add or edit courses"
            onClick={() => {/* Navigate to courses */}}
          />
          <ActionButton
            icon={<Shield size={24} />}
            title="Setup 2FA"
            description="Configure Google Authenticator"
            onClick={() => window.location.href = '/setup-2fa'}
          />
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, title, value, trend, color }) => {
  return (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-content">
        <h3>{title}</h3>
        <p className="metric-value">{value.toLocaleString()}</p>
        <span className="metric-trend">{trend}</span>
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton = ({ icon, title, description, onClick }) => {
  return (
    <button className="action-button" onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <div className="action-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </button>
  );
};

export default AdminDashboardOverview;
