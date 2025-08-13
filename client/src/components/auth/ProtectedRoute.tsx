import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/stores/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation('/auth/login');
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'engineer':
          setLocation('/engineer/work-queue');
          break;
        case 'head':
          setLocation('/head/operations');
          break;
        case 'exec':
          setLocation('/exec/roi');
          break;
        default:
          setLocation('/');
      }
    }
  }, [user, allowedRoles, setLocation]);

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
