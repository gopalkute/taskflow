// src/components/common/Spinner.jsx
// Reusable loading spinner

const Spinner = ({ size = "md", className = "" }) => {
  const sizes = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-primary-600 ${sizes[size]} ${className}`} />
  );
};

export const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
    <div className="text-center space-y-3">
      <Spinner size="lg" className="mx-auto" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading TaskFlow...</p>
    </div>
  </div>
);

export default Spinner;
