import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type Circle = {
  id: string;
  name: string;
  created_at: string;
  circle_members: { user_id: string }[];
};

export const CircleListPage = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch_ = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/app-admin/circles`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        },
      );

      const data = await res.json();
      setCircles(data);
      setLoading(false);
    };

    fetch_();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <h1>サークル一覧</h1>
        <Link
          to="/app-admin/circles/new"
          style={{
            padding: '10px 20px',
            background: '#1a73e8',
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          + サークル追加
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {circles.map((circle) => (
          <Link
            key={circle.id}
            to={`/app-admin/circles/${circle.id}`}
            style={{
              display: 'block',
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              border: '1px solid #eee',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2 style={{ margin: 0 }}>{circle.name}</h2>
              <span style={{ color: '#666', fontSize: '0.9em' }}>
                メンバー {circle.circle_members.length}人
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
