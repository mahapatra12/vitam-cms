import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { User, Mail, Phone, Shield, GraduationCap, Calendar, Edit2, Save } from 'lucide-react';

const StudentProfile = () => {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || '',
    address: '123 College Road, City', // Mock data
  });

  const { showToast } = useContext(AuthContext); // Assuming toast is available here or import it
  
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/update-profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEditing(false);
      // Ideally refresh user context here, but for now just UI update
      alert('Profile updated successfully'); 
    } catch (error) {
      console.error(error);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="text-text-secondary mt-1">Manage your personal information</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`btn-primary flex items-center gap-2 ${isEditing ? 'bg-green-500 hover:bg-green-600' : ''}`}
        >
          {isEditing ? <Save size={20} /> : <Edit2 size={20} />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="glass-card p-8 flex flex-col items-center text-center h-fit">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-1 mb-6">
            <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
              <span className="text-4xl font-bold text-white">{user?.name?.charAt(0)}</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-1">{user?.name}</h3>
          <p className="text-text-secondary mb-4">{user?.role?.toUpperCase()}</p>
          <div className="w-full pt-6 border-t border-white/10 space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Mail size={16} className="text-blue-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <Shield size={16} className="text-purple-400" />
              <span>ID: {user?._id?.substring(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Details Form */}
        <div className="md:col-span-2 glass-card p-8">
          <h3 className="text-xl font-bold mb-6">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">Department</label>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <GraduationCap className="text-blue-400" size={20} />
                <span className="font-medium">{user?.department || 'Computer Science'}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">Year / Semester</label>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <Calendar className="text-purple-400" size={20} />
                <span className="font-medium">Year {user?.year || 3}</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-6">Personal Details</h3>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">Phone Number</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="input-field w-full"
                />
              ) : (
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <Phone className="text-green-400" size={20} />
                  <span className="font-medium">{formData.phoneNumber || 'Not set'}</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2 block">Address</label>
              {isEditing ? (
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="input-field w-full h-24 resize-none"
                />
              ) : (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 min-h-[6rem]">
                  <span className="font-medium text-gray-300">{formData.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
