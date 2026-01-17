import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, CheckCircle, XCircle, Clock, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const LeaveRequests = () => {
  const [leaves, setLeaves] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch leaves for faculty in this department (Mocking the filter for now)
      const res = await axios.get('http://localhost:5000/api/leave?applicantRole=faculty', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
      // Mock data if API fails
      setLeaves([
        { _id: 1, applicant: { name: 'Dr. Smith', department: 'CSE' }, leaveType: 'Sick Leave', startDate: '2023-11-20', endDate: '2023-11-22', reason: 'Flu', status: 'Pending' },
        { _id: 2, applicant: { name: 'Prof. Johnson', department: 'CSE' }, leaveType: 'Casual Leave', startDate: '2023-12-05', endDate: '2023-12-06', reason: 'Family Event', status: 'Pending' },
      ]);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/leave/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast(`Leave ${status} successfully`, 'success');
      fetchLeaves();
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Faculty Leave Requests</h2>
        <p className="text-text-secondary mt-1">Approve or reject leave applications</p>
      </div>

      <div className="grid gap-4">
        {leaves.length === 0 ? (
          <p className="text-text-secondary">No pending leave requests.</p>
        ) : (
          leaves.map((leave) => (
            <div key={leave._id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white">
                  {leave.applicant?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{leave.applicant?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-xs">{leave.leaveType}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</span>
                  </div>
                  <p className="text-text-secondary text-sm italic">"{leave.reason}"</p>
                </div>
              </div>

              {leave.status === 'Pending' ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                    className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={18} />
                    <span>Reject</span>
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                    className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={18} />
                    <span>Approve</span>
                  </button>
                </div>
              ) : (
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold ${
                  leave.status === 'Approved' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'
                }`}>
                  {leave.status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  <span>{leave.status}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
