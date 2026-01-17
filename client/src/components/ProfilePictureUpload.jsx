import React, { useState } from 'react';
import axios from 'axios';
import { Camera, Upload, X } from 'lucide-react';
import './ProfilePictureUpload.css';

const ProfilePictureUpload = ({ currentImage, onUpdate }) => {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/upload-profile-image`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      onUpdate(res.data.imageUrl);
      setUploading(false);
    } catch (error) {
      console.error('Upload failed', error);
      setUploading(false);
    }
  };

  return (
    <div className="profile-upload-container">
      <div className="profile-image-wrapper">
        <img 
          src={preview || currentImage || 'https://ui-avatars.com/api/?name=User'} 
          alt="Profile" 
          className="profile-image"
        />
        <div className="upload-overlay">
          <label htmlFor="file-upload" className="upload-btn">
            {uploading ? <span className="spinner"></span> : <Camera size={20} />}
          </label>
          <input 
            id="file-upload" 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            hidden 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
