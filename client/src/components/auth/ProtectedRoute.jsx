// src/components/auth/ProtectedRoute.jsx
// Redirects unauthenticated users to login page

import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FullPageSpinner } from "../common/Spinner";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  // Show spinner while checking auth status
  if (loading) return <FullPageSpinner />;

  // If not authenticated, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
