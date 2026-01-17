import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import Table from '../../../components/Table';
import { useToast } from '../../../context/ToastContext';
import './SubjectManagement.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: '',
    semester: 1,
    credits: 3,
    type: 'Theory',
    description: '',
    syllabus: ''
  });
  const { showToast } = useToast();

  useEffect(() => {
    fetchSubjects();
    fetchDepartments();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data);
    } catch (error) {
      showToast('Failed to fetch subjects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/departments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (editingSubject) {
        await axios.put(
          `${API_URL}/subjects/${editingSubject._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Subject updated successfully', 'success');
      } else {
        await axios.post(
          `${API_URL}/subjects`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showToast('Subject created successfully', 'success');
      }
      
      closeModal();
      fetchSubjects();
    } catch (error) {
      showToast(error.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      department: subject.department._id,
      semester: subject.semester,
      credits: subject.credits,
      type: subject.type,
      description: subject.description || '',
      syllabus: subject.syllabus || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Subject deleted successfully', 'success');
      fetchSubjects();
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      department: '',
      semester: 1,
      credits: 3,
      type: 'Theory',
      description: '',
      syllabus: ''
    });
  };

  const columns = [
    { header: 'Code', key: 'code', width: '100px' },
    { header: 'Name', key: 'name' },
    { 
      header: 'Department', 
      key: 'department',
      render: (dept) => dept?.name || 'N/A'
    },
    { 
      header: 'Semester', 
      key: 'semester',
      align: 'center',
      width: '100px'
    },
    { 
      header: 'Credits', 
      key: 'credits',
      align: 'center',
      width: '80px'
    },
    { 
      header: 'Type', 
      key: 'type',
      width: '150px',
      render: (type) => (
        <span className={`badge badge-${type.toLowerCase().replace(' ', '-')}`}>
          {type}
        </span>
      )
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
    <div className="subject-management">
      <Card
        title="Subject Management"
        subtitle="Manage all subjects across departments"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            + Add Subject
          </Button>
        }
      >
        <Table 
          columns={columns}
          data={subjects}
          loading={loading}
          emptyMessage="No subjects found. Create your first subject!"
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="subject-form">
          <div className="form-row">
            <div className="form-group">
              <label>Subject Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Data Structures and Algorithms"
                required
              />
            </div>

            <div className="form-group">
              <label>Subject Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., CS201"
                required
                maxLength={10}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department *</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Semester *</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Credits *</label>
              <select
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                required
              >
                {[1, 2, 3, 4, 5, 6].map(credit => (
                  <option key={credit} value={credit}>{credit} Credits</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
                <option value="Theory + Practical">Theory + Practical</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the subject"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Syllabus URL</label>
            <input
              type="url"
              value={formData.syllabus}
              onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
              placeholder="https://example.com/syllabus.pdf"
            />
          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSubject ? 'Update' : 'Create'} Subject
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagement;
