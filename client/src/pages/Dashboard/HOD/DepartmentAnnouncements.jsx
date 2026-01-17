import { useState } from 'react';
import { Bell, Plus, Trash2, Send } from 'lucide-react';

const DepartmentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Department Meeting', content: 'All faculty members are requested to attend the monthly meeting.', date: '2023-11-20', audience: 'Faculty' },
    { id: 2, title: 'Mid-Term Schedule', content: 'Mid-term exams will start from next Monday.', date: '2023-11-18', audience: 'Students' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', audience: 'All' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const announcement = {
      id: Date.now(),
      ...newAnnouncement,
      date: new Date().toISOString().split('T')[0]
    };
    setAnnouncements([announcement, ...announcements]);
    setShowForm(false);
    setNewAnnouncement({ title: '', content: '', audience: 'All' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Department Announcements</h2>
          <p className="text-text-secondary mt-1">Manage notifications for your department</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          <span>New Announcement</span>
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 animate-fade-in">
          <h3 className="text-xl font-bold mb-4">Create Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Title</label>
              <input 
                type="text" 
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                className="input-field w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Content</label>
              <textarea 
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                className="input-field w-full h-32 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Audience</label>
              <select 
                value={newAnnouncement.audience}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, audience: e.target.value})}
                className="input-field w-full"
              >
                <option value="All">All Department</option>
                <option value="Faculty">Faculty Only</option>
                <option value="Students">Students Only</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl hover:bg-white/5">Cancel</button>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send size={18} />
                <span>Publish</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {announcements.map((item) => (
          <div key={item.id} className="glass-card p-6 flex items-start justify-between group">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  item.audience === 'Faculty' ? 'bg-purple-500/20 text-purple-300' : 
                  item.audience === 'Students' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {item.audience}
                </span>
                <span className="text-sm text-text-tertiary">{item.date}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-text-secondary">{item.content}</p>
            </div>
            <button 
              onClick={() => setAnnouncements(announcements.filter(a => a.id !== item.id))}
              className="p-2 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentAnnouncements;
