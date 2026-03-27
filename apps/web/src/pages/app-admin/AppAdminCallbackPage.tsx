import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AppAdminCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate('/app-admin/login');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      const profile = await res.json();

      if (!profile.is_app_admin) {
        navigate('/app-admin/unauthorized');
        return;
      }

      navigate('/app-admin');
    };

    check();
  }, [navigate]);

  return <div style={{ padding: '20px' }}>認証確認中...</div>;
};
