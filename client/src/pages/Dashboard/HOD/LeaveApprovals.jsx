import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock, FileText } from 'lucide-react';
import './LeaveApprovals.css';

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/hod/leaves/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (error) {
      console.error('Error fetching leaves', error);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_URL}/api/hod/leaves/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeaves(); // Refresh
    } catch (error) {
      console.error(`Error ${action} leave`, error);
    }
  };

  return (
    <div className="leave-approvals ios-app-container">
      <h2 className="ios-section-title">Pending Leave Requests</h2>
      
      <div className="ios-list">
        {leaves.length > 0 ? (
          leaves.map((leave) => (
            <div key={leave._id} className="ios-list-item leave-card">
              <div className="leave-info">
                <div className="applicant-info">
                  <img src={`https://ui-avatars.com/api/?name=${leave.faculty.name}`} alt="Profile" className="avatar-sm" />
                  <div>
                    <h3>{leave.faculty.name}</h3>
                    <p className="leave-type">{leave.type} • {leave.days} Days</p>
                  </div>
                </div>
                <div className="leave-dates">
                  <Clock size={16} />
                  <span>{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                </div>
                <p className="leave-reason">"{leave.reason}"</p>
              </div>
              
              <div className="leave-actions">
                <button className="action-btn approve" onClick={() => handleAction(leave._id, 'approve')}>
                  <Check size={20} />
                </button>
                <button className="action-btn reject" onClick={() => handleAction(leave._id, 'reject')}>
                  <X size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FileText size={48} />
            <p>No pending leave requests</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveApprovals;
