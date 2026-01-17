import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Mock Data for now, replace with API call
  useEffect(() => {
    setLeaves([
      { _id: 1, type: 'Sick Leave', startDate: '2023-11-10', endDate: '2023-11-12', reason: 'Viral Fever', status: 'Approved' },
      { _id: 2, type: 'Casual Leave', startDate: '2023-12-01', endDate: '2023-12-01', reason: 'Personal Work', status: 'Pending' },
    ]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const leave = {
      _id: Date.now(),
      ...newLeave,
      status: 'Pending'
    };
    setLeaves([leave, ...leaves]);
    setShowForm(false);
    setNewLeave({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Rejected': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Leave Management</h2>
          <p className="text-text-secondary mt-1">Apply for leave and track status</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Apply Leave</span>
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">New Leave Application</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Leave Type</label>
                <select 
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({...newLeave, type: e.target.value})}
                  className="input-field w-full"
                >
                  <option>Sick Leave</option>
                  <option>Casual Leave</option>
                  <option>Duty Leave</option>
                  <option>Earned Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">From</label>
                  <input 
                    type="date" 
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({...newLeave, startDate: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">To</label>
                  <input 
                    type="date" 
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({...newLeave, endDate: e.target.value})}
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Reason</label>
              <textarea 
                value={newLeave.reason}
                onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                className="input-field w-full h-24 resize-none"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl hover:bg-white/5">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <CheckCircle size={18} />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {leaves.map((leave) => (
          <div key={leave._id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                leave.type === 'Sick Leave' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{leave.type}</h3>
                <p className="text-text-secondary text-sm">{leave.reason}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-text-tertiary">
                  <Clock size={14} />
                  <span>{leave.startDate} to {leave.endDate}</span>
                </div>
              </div>
            </div>
            
            <div className={`px-4 py-2 rounded-full border flex items-center gap-2 text-sm font-bold ${getStatusColor(leave.status)}`}>
              {getStatusIcon(leave.status)}
              <span>{leave.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveManagement;
