import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Calendar, User } from 'lucide-react';

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);

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

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bell size={20} className="text-yellow-400" />
        Latest Announcements
      </h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {announcements.map((ann) => (
          <div key={ann._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                ann.type === 'Urgent' ? 'bg-red-500/20 text-red-300' :
                ann.type === 'Event' ? 'bg-purple-500/20 text-purple-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {ann.type}
              </span>
              <span className="text-xs text-text-secondary flex items-center gap-1">
                <Calendar size={12} />
                {new Date(ann.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h4 className="font-bold text-lg mb-1">{ann.title}</h4>
            <p className="text-sm text-text-secondary mb-3">{ann.content}</p>
            <div className="flex items-center gap-2 text-xs text-text-tertiary border-t border-white/5 pt-2">
              <User size={12} />
              <span>Posted by {ann.createdBy?.name || 'Admin'}</span>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-center text-text-secondary py-8">No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsList;
