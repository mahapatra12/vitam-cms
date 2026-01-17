import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Table from '../../../components/Table';
import { useToast } from '../../../context/ToastContext';
import './SessionManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SessionManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    currentSemester: 1,
    academicYear: '',
    isActive: false
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data);
    } catch (error) {
      showToast('Failed to fetch sessions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingSession) {
        await axios.put(
          `${API_URL}/sessions/${editingSession._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Session updated successfully', 'success');
      } else {
        await axios.post(
          `${API_URL}/sessions`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Session created successfully', 'success');
      }
      
      closeModal();
      fetchSessions();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleSetActive = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/sessions/${id}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Session activated successfully', 'success');
      fetchSessions();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to activate session', 'error');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      name: session.name,
      startDate: session.startDate.split('T')[0],
      endDate: session.endDate.split('T')[0],
      currentSemester: session.currentSemester,
      academicYear: session.academicYear,
      isActive: session.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Session deleted successfully', 'success');
      fetchSessions();
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSession(null);
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      currentSemester: 1,
      academicYear: '',
      isActive: false
    });
  };

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Academic Year', key: 'academicYear', width: '150px' },
    { 
      header: 'Start Date', 
      key: 'startDate',
      width: '120px',
      render: (date) => new Date(date).toLocaleDateString()
    },
    { 
      header: 'End Date', 
      key: 'endDate',
      width: '120px',
      render: (date) => new Date(date).toLocaleDateString()
    },
    { 
      header: 'Current Sem', 
      key: 'currentSemester',
      align: 'center',
      width: '100px'
    },
    { 
      header: 'Status', 
      key: 'isActive',
      align: 'center',
      width: '100px',
      render: (isActive) => (
        <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'center',
      width: '250px',
      render: (_, row) => (
        <div className="action-buttons">
          {!row.isActive && (
            <Button 
              size="sm" 
              variant="success"
              onClick={(e) => {
                e.stopPropagation();
                handleSetActive(row._id);
              }}
            >
              Activate
            </Button>
          )}
          <Button 
            size="sm" 
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row._id);
            }}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="session-management">
      <Card
        title="Session Management"
        subtitle="Manage academic sessions and years"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            + Add Session
          </Button>
        }
      >
        <Table 
          columns={columns}
          data={sessions}
          loading={loading}
          emptyMessage="No sessions found. Create your first session!"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSession ? 'Edit Session' : 'Add Session'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="session-form">
          <div className="form-group">
            <label>Session Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., 2024-25 Academic Year"
              required
            />
          </div>

          <div className="form-group">
            <label>Academic Year *</label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              placeholder="e.g., 2024-2025"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Current Semester *</label>
            <select
              value={formData.currentSemester}
              onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value) })}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSession ? 'Update' : 'Create'} Session
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SessionManagement;
