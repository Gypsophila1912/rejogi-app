import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
  const { session, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '20px' }}>認証状態を確認しています...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
