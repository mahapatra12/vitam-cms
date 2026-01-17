import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Plus, Megaphone } from 'lucide-react';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'global' });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/announcements', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnouncements();
      setShowModal(false);
      setFormData({ title: '', content: '', type: 'global' });
    } catch (err) {
      alert('Error creating announcement');
    }
  };

  return (
    <div className="glass-card p-8 min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="text-text-secondary mt-1">Broadcast messages to the college</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((item) => (
          <div key={item._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20 flex-shrink-0">
              <Megaphone className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-white/10 uppercase tracking-wider">{item.type}</span>
              </div>
              <p className="text-text-secondary mb-2">{item.content}</p>
              <p className="text-xs text-gray-500">Posted by {item.createdBy?.name} • {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="glass w-full max-w-md p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">New Announcement</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Content</label>
                <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:bg-white/10 outline-none min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-black/40 border-white/10">
                  <option value="global">Global</option>
                  <option value="department">Department</option>
                  <option value="faculty">Faculty Only</option>
                  <option value="student">Students Only</option>
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementManagement;
