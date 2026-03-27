import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const NicknamePage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const joinCircle = async () => {
      const inviteToken = sessionStorage.getItem('inviteToken');
      if (!inviteToken) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      await fetch('http://localhost:3000/auth/join', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: inviteToken }),
      });

      // 成功失敗に関わらずtokenを削除してニックネーム入力に進む
      sessionStorage.removeItem('inviteToken');
    };

    joinCircle();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log('session:', session); // 追加

    if (!session) {
      console.log('sessionがないです');
      return;
    }

    const res = await fetch('http://localhost:3000/auth/profile', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    console.log('profile result:', res.status, data); // 追加

    if (res.ok) {
      navigate('/admin');
    } else {
      alert('保存に失敗しました');
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>
          ニックネームを設定
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          レジ画面で表示される名前を入力してください
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ニックネームを入力"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1em',
            marginBottom: '15px',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !name.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1em',
          }}
        >
          {loading ? '保存中...' : '保存してはじめる'}
        </button>
      </div>
    </div>
  );
};
