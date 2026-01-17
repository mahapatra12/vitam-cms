import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Terminal, Clock } from 'lucide-react';
import './SystemLogs.css';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data);
    } catch (error) {
      console.error('Error fetching logs', error);
    }
  };

  return (
    <div className="system-logs ios-app-container">
      <h2 className="ios-section-title">System Audit Logs</h2>
      
      <div className="logs-container ios-card">
        <div className="logs-header">
          <Terminal size={20} />
          <span>Recent Activity</span>
        </div>
        
        <div className="logs-list">
          {logs.map((log) => (
            <div key={log._id} className="log-item">
              <div className="log-icon">
                <Activity size={16} />
              </div>
              <div className="log-content">
                <div className="log-top">
                  <span className="log-action">{log.action}</span>
                  <span className="log-time">
                    <Clock size={12} />
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="log-details">
                  <span className="log-user">
                    {log.user ? `${log.user.name} (${log.user.role})` : 'System'}
                  </span>
                  <span className="log-meta">
                    {JSON.stringify(log.details)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
