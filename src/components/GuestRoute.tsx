import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { selectIsAuthenticated } from '../store/slices/authSlice';

interface GuestRouteProps {
  children: React.ReactNode;
}

function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default GuestRoute;