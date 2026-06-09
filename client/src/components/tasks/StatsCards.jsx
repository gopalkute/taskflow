// src/components/tasks/StatsCards.jsx
// Dashboard statistics cards

const StatCard = ({ label, value, icon, colorClass, subLabel }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
      {subLabel && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subLabel}</p>}
    </div>
  </div>
);

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className="shimmer w-12 h-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <div className="shimmer h-6 w-12 rounded" />
              <div className="shimmer h-4 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Total Tasks",
      value: stats.total,
      subLabel: "All time",
      colorClass: "bg-primary-100 dark:bg-primary-900/30",
      icon: (
        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: stats.completed,
      subLabel: "Done ✓",
      colorClass: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: (
        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: stats.pending,
      subLabel: "In progress",
      colorClass: "bg-yellow-100 dark:bg-yellow-900/30",
      icon: (
        <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Completion Rate",
      value: `${stats.completionRate}%`,
      subLabel: stats.total > 0 ? `${stats.completed} of ${stats.total}` : "No tasks yet",
      colorClass: "bg-purple-100 dark:bg-purple-900/30",
      icon: (
        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => <StatCard key={card.label} {...card} />)}
    </div>
  );
};

export default StatsCards;
