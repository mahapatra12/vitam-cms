import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import './StudyMaterials.css';

const StudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchMaterials();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/faculty/subjects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(res.data);
    } catch (error) {
      console.error('Error fetching subjects', error);
    }
  };

  const fetchMaterials = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/study-materials`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterials(res.data);
    } catch (error) {
      console.error('Error fetching materials', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedSubject) {
      alert('Please select a subject first');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subjectId', selectedSubject);
    formData.append('title', file.name);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_URL}/api/study-materials/upload`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchMaterials();
      alert('Material uploaded successfully');
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/study-materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMaterials();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="study-materials ios-app-container">
      <h2 className="ios-section-title">Study Materials</h2>

      <div className="upload-card ios-card">
        <div className="upload-controls">
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>

          <label className="upload-btn">
            <Upload size={18} />
            <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
            <input type="file" hidden onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="materials-grid">
        {materials.map(material => (
          <div key={material._id} className="material-card ios-card">
            <div className="material-icon">
              <FileText size={32} />
            </div>
            <div className="material-info">
              <h3>{material.title}</h3>
              <p>{material.subject?.name}</p>
              <span className="material-date">
                {new Date(material.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="material-actions">
              <button className="action-icon" onClick={() => window.open(material.fileUrl)}>
                <Download size={18} />
              </button>
              <button className="action-icon delete" onClick={() => handleDelete(material._id)}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterials;
