import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Table from '../../../components/Table';
import { useToast } from '../../../context/ToastContext';
import './DepartmentManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', hod: '' });
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
    } catch (error) {
      showToast('Failed to fetch departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.filter(u => u.role === 'hod' || u.role === 'faculty'));
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingDepartment) {
        await axios.put(
          `${API_URL}/departments/${editingDepartment._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Department updated successfully', 'success');
      } else {
        await axios.post(
          `${API_URL}/departments`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Department created successfully', 'success');
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', code: '', hod: '' });
      setEditingDepartment(null);
      fetchDepartments();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      hod: department.hod?._id || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Department deleted successfully', 'success');
      fetchDepartments();
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const columns = [
    { header: 'Code', key: 'code', width: '100px' },
    { header: 'Name', key: 'name' },
    { 
      header: 'HOD', 
      key: 'hod',
      render: (hod) => hod ? hod.name : 'Not Assigned'
    },
    { 
      header: 'Students', 
      key: 'studentCount',
      align: 'center',
      width: '100px'
    },
    { 
      header: 'Faculty', 
      key: 'facultyCount',
      align: 'center',
      width: '100px'
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'center',
      width: '200px',
      render: (_, row) => (
        <div className="action-buttons">
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
    <div className="department-management">
      <Card
        title="Department Management"
        subtitle="Manage all departments and assign HODs"
        actions={
          <Button onClick={() => {
            setEditingDepartment(null);
            setFormData({ name: '', code: '', hod: '' });
            setIsModalOpen(true);
          }}>
            + Add Department
          </Button>
        }
      >
        <Table 
          columns={columns}
          data={departments}
          loading={loading}
          emptyMessage="No departments found. Create your first department!"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
          setFormData({ name: '', code: '', hod: '' });
        }}
        title={editingDepartment ? 'Edit Department' : 'Add Department'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="department-form">
          <div className="form-group">
            <label>Department Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Computer Science & Engineering"
              required
            />
          </div>

          <div className="form-group">
            <label>Department Code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g., CSE"
              required
              maxLength={10}
            />
          </div>

          <div className="form-group">
            <label>Head of Department</label>
            <select
              value={formData.hod}
              onChange={(e) => setFormData({ ...formData, hod: e.target.value })}
            >
              <option value="">Select HOD</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setEditingDepartment(null);
                setFormData({ name: '', code: '', hod: '' });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingDepartment ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
