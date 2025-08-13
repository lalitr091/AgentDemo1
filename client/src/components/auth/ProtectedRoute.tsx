import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '@/stores/auth';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: string[];
  redirectToRoleDashboard?: boolean;
}

export function ProtectedRoute({ children, allowedRoles, redirectToRoleDashboard }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation('/auth/login');
      return;
    }

    // If this is a role dashboard redirect request, redirect immediately
    if (redirectToRoleDashboard) {
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
          setLocation('/engineer/work-queue');
      }
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
  }, [user, allowedRoles, redirectToRoleDashboard, setLocation]);

  if (!user) {
    return null;
  }

  // If redirecting to role dashboard, don't render children
  if (redirectToRoleDashboard) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
