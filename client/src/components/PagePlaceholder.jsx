import { Construction } from 'lucide-react';

const PagePlaceholder = ({ title }) => {
  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
        <Construction className="text-blue-400" size={48} />
      </div>
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-text-secondary max-w-md">
        This module is currently under development. The core infrastructure and security layers are ready.
      </p>
    </div>
  );
};

export default PagePlaceholder;
