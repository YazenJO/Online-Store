import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * Admin Route Guard
 * 
 * Protects admin-only routes by checking:
 * 1. User is authenticated
 * 2. User has "Admin" role
 * 
 * If conditions are not met, redirects to login or home page
 */
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, customer, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (customer?.role !== 'Admin') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You do not have permission to access this page. Admin privileges required.
            </p>
            <a href="/" className="mt-4 inline-block text-primary hover:underline">
              Return to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin
  return <>{children}</>;
};

export default AdminRoute;
