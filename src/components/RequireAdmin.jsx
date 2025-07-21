import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

// This wrapper will check for admin role and user login
export default function RequireAdmin({ children }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-24">Checking authentication...</div>
    );
  }

  if (!user) {
    // Not logged in: redirect to login, preserve location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role !== "admin") {
    // Logged in but not admin: show forbidden
    return (
      <div className="max-w-lg mx-auto mt-32 p-6 bg-white rounded-xl shadow-lg text-red-500 text-center text-lg">
        Forbidden: Only admin can access this page.
      </div>
    );
  }

  return children;
}
