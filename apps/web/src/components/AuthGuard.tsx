import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export const requireAuth = (
  WrappedComponent: React.ComponentType<Record<string, unknown>>,
) => {
  return (props: Record<string, unknown>) => {
    const { session, loading } = useAuth();

    if (loading) {
      return <div style={{ padding: '20px' }}>認証状態を確認しています...</div>;
    }

    if (!session) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export const AuthGuard: React.FC = () => {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: '20px' }}>認証状態を確認しています...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (profile) {
    if (!profile.name || profile.name === '名無し') {
      return <Navigate to="/nickname" replace />;
    }

    const circles = profile.circle_members || [];
    const activeCircleId = sessionStorage.getItem('active_circle_id');

    if (!activeCircleId) {
      if (circles.length === 1) {
        sessionStorage.setItem('active_circle_id', circles[0].circles.id);
      } else if (circles.length > 1 && location.pathname !== '/circle-select') {
        return <Navigate to="/circle-select" replace />;
      }
    }
  }

  return <Outlet />;
};
