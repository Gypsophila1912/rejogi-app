import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type InviteToken = {
  id: string;
  token: string;
  role: string;
  created_at: string;
};

type Member = {
  user_id: string;
  role: string;
  joined_at: string;
  profiles: { id: string; name: string };
};

type CircleDetail = {
  id: string;
  name: string;
  created_at: string;
  invite_tokens: InviteToken[];
  circle_members: Member[];
};

export const CircleDetailPage = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const [circle, setCircle] = useState<CircleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedTokens, setCopiedTokens] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/app-admin/circles/${circleId}`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          },
        );
        if (!res.ok) throw new Error('fetch failed');

        const data = await res.json();
        setCircle(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch_();
  }, [circleId]);

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;
  if (!circle)
    return <div style={{ padding: '20px' }}>サークルが見つかりません</div>;

  const baseUrl = window.location.origin;

  const handleCopy = async (url: string, tokenId: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedTokens((prev) => ({ ...prev, [tokenId]: true }));
    setTimeout(() => {
      setCopiedTokens((prev) => ({ ...prev, [tokenId]: false }));
    }, 2000);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>{circle.name}</h1>

      {/* 招待URL */}
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '15px' }}>招待URL</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {circle.invite_tokens.map((token) => (
            <div
              key={token.id}
              style={{
                padding: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #eee',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    padding: '2px 8px',
                    background:
                      token.role === 'circle_admin' ? '#e8f0fe' : '#e6f4ea',
                    color:
                      token.role === 'circle_admin' ? '#1a73e8' : '#34a853',
                    borderRadius: '4px',
                    fontSize: '0.85em',
                    fontWeight: 'bold',
                  }}
                >
                  {token.role === 'circle_admin' ? '管理者' : '一般'}
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <code
                  style={{
                    flex: 1,
                    padding: '8px',
                    background: '#f5f5f5',
                    borderRadius: '4px',
                    fontSize: '0.85em',
                    wordBreak: 'break-all',
                  }}
                >
                  {`${baseUrl}/invite?token=${token.token}`}
                </code>
                <button
                  onClick={() =>
                    handleCopy(
                      `${baseUrl}/invite?token=${token.token}`,
                      token.id,
                    )
                  }
                  style={{
                    padding: '8px 12px',
                    background: copiedTokens[token.id] ? '#34a853' : '#1a73e8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.2s',
                  }}
                >
                  {copiedTokens[token.id] ? 'コピー済み ✓' : 'コピー'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* メンバー一覧 */}
      <section>
        <h2 style={{ marginBottom: '15px' }}>
          メンバー（{circle.circle_members.length}人）
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {circle.circle_members.map((member) => (
            <div
              key={member.user_id}
              style={{
                padding: '15px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{member.profiles.name}</span>
              <span
                style={{
                  padding: '2px 8px',
                  background:
                    member.role === 'circle_admin' ? '#e8f0fe' : '#e6f4ea',
                  color: member.role === 'circle_admin' ? '#1a73e8' : '#34a853',
                  borderRadius: '4px',
                  fontSize: '0.85em',
                }}
              >
                {member.role === 'circle_admin' ? '管理者' : '一般'}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
