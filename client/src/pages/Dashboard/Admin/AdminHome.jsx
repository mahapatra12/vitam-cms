import AnnouncementsList from '../../components/AnnouncementsList';
import StatCard from '../../components/StatCard';
import { Users, BookOpen, Building2, Bell } from 'lucide-react';

const AdminHome = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Total Users" value="1,250" icon={Users} color="bg-blue-500" />
          <StatCard title="Departments" value="8" icon={Building2} color="bg-purple-500" />
          <StatCard title="Courses" value="42" icon={BookOpen} color="bg-orange-500" />
          <StatCard title="Active Alerts" value="5" icon={Bell} color="bg-red-500" />
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4">System Status</h2>
          <p className="text-text-secondary mb-6">
            All systems operational. Database backup completed successfully at 03:00 AM.
          </p>
        </div>
      </div>

      <div className="lg:col-span-1">
        <AnnouncementsList />
      </div>
    </div>
  );
};

export default AdminHome;
