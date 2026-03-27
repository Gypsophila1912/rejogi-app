import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AppAdminGuard = () => {
  const [status, setStatus] = useState<'loading' | 'ok' | 'ng'>('loading');

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setStatus('ng');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const profile = await res.json();
      setStatus(profile.is_app_admin ? 'ok' : 'ng');
    };

    check();
  }, []);

  if (status === 'loading')
    return <div style={{ padding: '20px' }}>確認中...</div>;
  if (status === 'ng') return <Navigate to="/app-admin/login" replace />;

  return <Outlet />;
};
