import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import './StudyMaterials.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    category: 'Notes',
    semester: 1
  });
  const { user } = useAuth();
  const { showToast } = useToast();
  const isFaculty = user.role === 'faculty' || user.role === 'admin';

  useEffect(() => {
    fetchMaterials();
    fetchSubjects();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isFaculty 
        ? `${API_URL}/study-materials`
        : `${API_URL}/study-materials/my-materials`;
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(response.data);
    } catch (error) {
      showToast('Failed to fetch study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Failed to fetch subjects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/study-materials`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Study material uploaded successfully', 'success');
      closeModal();
      fetchMaterials();
    } catch (error) {
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    }
  };

  const handleDownload = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/study-materials/${id}/download`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast('Download started', 'success');
    } catch (error) {
      showToast('Download failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this material?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/study-materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Material deleted successfully', 'success');
      fetchMaterials();
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      title: '',
      description: '',
      subject: '',
      category: 'Notes',
      semester: 1
    });
  };

  const filteredMaterials = materials.filter(m => {
    const subjectMatch = filterSubject === 'all' || m.subject?._id === filterSubject;
    const categoryMatch = filterCategory === 'all' || m.category === filterCategory;
    return subjectMatch && categoryMatch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Notes': return '📝';
      case 'Assignment': return '📋';
      case 'Question Paper': return '📄';
      case 'Reference Book': return '📚';
      case 'Video': return '🎥';
      default: return '📎';
    }
  };

  return (
    <div className="study-materials">
      <Card
        title="Study Materials"
        subtitle={isFaculty ? "Upload and manage study materials" : "Download study materials"}
        actions={
          <div className="header-actions">
            <select 
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="Notes">Notes</option>
              <option value="Assignment">Assignment</option>
              <option value="Question Paper">Question Paper</option>
              <option value="Reference Book">Reference Book</option>
              <option value="Video">Video</option>
            </select>
            {isFaculty && (
              <Button onClick={() => setIsModalOpen(true)}>
                + Upload Material
              </Button>
            )}
          </div>
        }
      >
        {loading ? (
          <div className="loading-state">Loading materials...</div>
        ) : filteredMaterials.length > 0 ? (
          <div className="materials-grid">
            {filteredMaterials.map(material => (
              <div key={material._id} className="material-card">
                <div className="material-icon">
                  {getCategoryIcon(material.category)}
                </div>
                <div className="material-content">
                  <h3 className="material-title">{material.title}</h3>
                  <p className="material-description">{material.description}</p>
                  <div className="material-meta">
                    <span className="meta-item">
                      📚 {material.subject?.name || 'N/A'}
                    </span>
                    <span className="meta-item">
                      📅 Sem {material.semester}
                    </span>
                    <span className="meta-item">
                      👤 {material.uploadedBy?.name}
                    </span>
                    <span className="meta-item">
                      ⬇️ {material.downloads} downloads
                    </span>
                  </div>
                  <div className="material-footer">
                    <span className={`category-badge ${material.category.toLowerCase().replace(' ', '-')}`}>
                      {material.category}
                    </span>
                    <div className="material-actions">
                      <Button 
                        size="sm" 
                        variant="primary"
                        onClick={() => handleDownload(material._id)}
                      >
                        Download
                      </Button>
                      {isFaculty && material.uploadedBy?._id === user._id && (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => handleDelete(material._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No study materials found.</p>
            {isFaculty && <p className="empty-subtitle">Upload your first material to get started!</p>}
          </div>
        )}
      </Card>

      {isFaculty && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Upload Study Material"
          size="md"
        >
          <form onSubmit={handleSubmit} className="material-form">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Data Structures - Unit 1 Notes"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the material"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Subject *</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="Notes">Notes</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Question Paper">Question Paper</option>
                  <option value="Reference Book">Reference Book</option>
                  <option value="Video">Video</option>
                </select>
              </div>
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

            <div className="form-note">
              <p>📎 Note: File upload functionality will be available soon. This creates a placeholder entry.</p>
            </div>

            <div className="form-actions">
              <Button type="button" variant="ghost" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Upload Material
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudyMaterials;
