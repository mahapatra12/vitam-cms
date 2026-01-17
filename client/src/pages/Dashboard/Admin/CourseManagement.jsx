import { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Plus, Trash2, User } from 'lucide-react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', department: '', semester: '', credits: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/academic/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/academic/courses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCourses();
      setShowModal(false);
      setFormData({ name: '', code: '', department: '', semester: '', credits: '' });
    } catch (err) {
      alert('Error creating course');
    }
  };

  return (
    <div className="glass-card p-8 min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
          <p className="text-text-secondary mt-1">Manage subjects and curriculum</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Book className="text-white" size={24} />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-white/10 uppercase tracking-wider font-bold">{course.code}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-1">{course.name}</h3>
            <p className="text-sm text-text-secondary mb-4">{course.department} • Sem {course.semester}</p>
            
            <div className="flex gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <User size={16} />
                <span>{course.assignedFaculty?.name || 'Unassigned'}</span>
              </div>
              <div className="ml-auto text-sm font-mono text-blue-300">
                {course.credits} Credits
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="glass w-full max-w-md p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Add New Course</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Course Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-white/5 border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Code</label>
                  <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Credits</label>
                  <input type="number" value={formData.credits} onChange={e => setFormData({...formData, credits: e.target.value})} required className="bg-white/5 border-white/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Department</label>
                  <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} required className="bg-white/5 border-white/10" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Semester</label>
                  <input type="text" value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} required className="bg-white/5 border-white/10" />
                </div>
              </div>
              
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
