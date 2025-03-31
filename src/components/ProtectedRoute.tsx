
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'user';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole = 'user' 
}) => {
  console.log("ProtectedRoute component rendering");
  const { user, hasPermission } = useAuth();

  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/" replace />;
  }

  if (!hasPermission(requiredRole)) {
    console.log("ProtectedRoute: User doesn't have permission, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("ProtectedRoute: User has permission, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
