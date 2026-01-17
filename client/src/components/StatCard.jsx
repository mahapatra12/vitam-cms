const StatCard = ({ title, value, icon: Icon, color }) => {
  // Extract color class to use for shadow/glow
  const glowColor = color.replace('bg-', 'shadow-').replace('500', '500/40');
  
  return (
    <div className="glass-card p-6 flex items-center justify-between group cursor-default">
      <div>
        <p className="text-text-secondary text-sm font-medium mb-2 uppercase tracking-wider">{title}</p>
        <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="text-white" size={28} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default StatCard;
