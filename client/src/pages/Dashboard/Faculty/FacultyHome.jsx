import AnnouncementsList from '../../components/AnnouncementsList';
import StatCard from '../../components/StatCard';
import { Users, BookOpen, Calendar, FileText } from 'lucide-react';

const FacultyHome = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="My Classes" value="4" icon={BookOpen} color="bg-orange-500" />
          <StatCard title="Total Students" value="142" icon={Users} color="bg-blue-500" />
          <StatCard title="Pending Marks" value="2" icon={FileText} color="bg-red-500" />
          <StatCard title="Today's Lectures" value="3" icon={Calendar} color="bg-green-500" />
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">Faculty Dashboard</h2>
          <p className="text-text-secondary mb-6">
            Don't forget to mark attendance for CSE201 today. Mid-term marks submission deadline is approaching.
          </p>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AnnouncementsList />
      </div>
    </div>
  );
};

export default FacultyHome;
