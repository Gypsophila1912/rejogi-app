import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const InvitePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      sessionStorage.setItem('inviteToken', token);
    }

    navigate('/login');
  }, [navigate]);

  return <div>リダイレクト中...</div>;
};
