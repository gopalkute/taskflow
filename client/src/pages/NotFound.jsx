// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
    <div className="text-center animate-fade-in">
      <div className="text-8xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary inline-flex">
        ← Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFound;
