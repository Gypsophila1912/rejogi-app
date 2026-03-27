import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type CircleMember = {
  role: string;
  circles: { id: string; name: string };
};

type Member = {
  id: string;
  name: string;
  is_app_admin: boolean;
  created_at: string;
  circle_members: CircleMember[];
};

export const MemberListPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/app-admin/members`,
          {
            headers: { Authorization: `Bearer ${session.access_token}` },
          },
        );
        if (!res.ok) throw new Error('fetch failed');

        const data = await res.json();
        setMembers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetch_();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>メンバー一覧</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            style={{
              padding: '15px 20px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #eee',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                {member.name}
              </span>
              {member.is_app_admin && (
                <span
                  style={{
                    padding: '2px 8px',
                    background: '#fce8e6',
                    color: '#ea4335',
                    borderRadius: '4px',
                    fontSize: '0.8em',
                  }}
                >
                  アプリ管理者
                </span>
              )}
            </div>
            <span style={{ color: '#666', fontSize: '0.9em' }}>
              {member.circle_members.length}サークル所属
            </span>
          </div>
        ))}
      </div>

      {/* モーダル */}
      {selectedMember && (
        <div
          onClick={() => setSelectedMember(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              width: '100%',
              maxWidth: '400px',
            }}
          >
            <h2 style={{ marginBottom: '20px' }}>{selectedMember.name}</h2>
            <h3 style={{ marginBottom: '10px', color: '#666' }}>
              所属サークル
            </h3>
            {selectedMember.circle_members.length === 0 ? (
              <p style={{ color: '#999' }}>サークル未所属</p>
            ) : (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {selectedMember.circle_members.map((cm) => (
                  <div
                    key={cm.circles.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: '#f5f5f5',
                      borderRadius: '6px',
                    }}
                  >
                    <span>{cm.circles.name}</span>
                    <span style={{ color: '#666', fontSize: '0.9em' }}>
                      {cm.role === 'circle_admin' ? '管理者' : '一般'}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setSelectedMember(null)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '10px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
