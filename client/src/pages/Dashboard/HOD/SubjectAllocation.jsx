import { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, User, CheckCircle, Search } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const SubjectAllocation = () => {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    // Mock Data Loading
    setSubjects([
      { _id: 1, name: 'Data Structures', code: 'CS101', semester: 3, assignedTo: null },
      { _id: 2, name: 'Algorithms', code: 'CS102', semester: 4, assignedTo: 'Dr. Smith' },
      { _id: 3, name: 'Database Systems', code: 'CS201', semester: 3, assignedTo: null },
    ]);
    setFaculty([
      { _id: 'f1', name: 'Dr. Smith' },
      { _id: 'f2', name: 'Prof. Johnson' },
      { _id: 'f3', name: 'Dr. Williams' },
    ]);
  }, []);

  const handleAssign = (subjectId, facultyName) => {
    setSubjects(subjects.map(s => 
      s._id === subjectId ? { ...s, assignedTo: facultyName } : s
    ));
    addToast(`Assigned ${facultyName} to subject`, 'success');
    // In real app: API call to update course/subject
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Subject Allocation</h2>
        <p className="text-text-secondary mt-1">Assign subjects to faculty members</p>
      </div>

      <div className="grid gap-4">
        {subjects.map((subject) => (
          <div key={subject._id} className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-[200px]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <BookOpen className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">{subject.name}</h3>
                <p className="text-sm text-text-secondary">{subject.code} • Sem {subject.semester}</p>
              </div>
            </div>

            <div className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <select 
                    className="input-field w-full pl-10"
                    value={subject.assignedTo || ''}
                    onChange={(e) => handleAssign(subject._id, e.target.value)}
                  >
                    <option value="">Select Faculty</option>
                    {faculty.map(f => (
                      <option key={f._id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>
                {subject.assignedTo && (
                  <div className="text-green-400 flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                    <CheckCircle size={16} />
                    <span>Assigned</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectAllocation;
