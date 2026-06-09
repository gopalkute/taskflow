// src/components/common/EmptyState.jsx
// Shown when no tasks exist or search returns nothing

const EmptyState = ({ title = "No tasks yet", description = "Create your first task to get started.", action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    {/* Illustration */}
    <div className="w-24 h-24 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6">
      <svg className="w-12 h-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">{description}</p>
    {action && action}
  </div>
);

export default EmptyState;
