import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type InviteUrls = {
  admin: string;
  general: string;
};

export const CircleNewPage = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteUrls, setInviteUrls] = useState<InviteUrls | null>(null);
  const navigate = useNavigate();
  const [copiedAdmin, setCopiedAdmin] = useState(false);
  const [copiedGeneral, setCopiedGeneral] = useState(false);

  const handleCopy = async (url: string, type: 'admin' | 'general') => {
    await navigator.clipboard.writeText(url);
    if (type === 'admin') {
      setCopiedAdmin(true);
      setTimeout(() => setCopiedAdmin(false), 2000);
    } else {
      setCopiedGeneral(true);
      setTimeout(() => setCopiedGeneral(false), 2000);
    }
  };
  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/app-admin/circles`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setInviteUrls(data.invite_urls);
      } else {
        alert('サークルの追加に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  // サークル作成後は招待URLを表示
  if (inviteUrls) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '10px' }}>サークルを作成しました</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          以下の招待URLをメンバーに共有してください
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* 管理者用URL */}
          <div
            style={{
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e8f0fe',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#1a73e8' }}>
                管理者用URL
              </span>
              <button
                onClick={() => handleCopy(inviteUrls.admin, 'admin')}
                style={{
                  padding: '4px 10px',
                  background: copiedAdmin ? '#34a853' : '#1a73e8',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                  transition: 'background 0.2s',
                }}
              >
                {copiedAdmin ? 'コピー済み ✓' : 'コピー'}
              </button>
            </div>
            <code
              style={{
                display: 'block',
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '0.8em',
                wordBreak: 'break-all',
              }}
            >
              {inviteUrls.admin}
            </code>
          </div>

          {/* 一般用URL */}
          <div
            style={{
              padding: '20px',
              background: 'white',
              borderRadius: '8px',
              border: '1px solid #e6f4ea',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#34a853' }}>
                一般用URL
              </span>
              <button
                onClick={() => handleCopy(inviteUrls.general, 'general')}
                style={{
                  padding: '4px 10px',
                  background: copiedGeneral ? '#1a73e8' : '#34a853',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85em',
                  transition: 'background 0.2s',
                }}
              >
                {copiedGeneral ? 'コピー済み ✓' : 'コピー'}
              </button>
            </div>
            <code
              style={{
                display: 'block',
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '0.8em',
                wordBreak: 'break-all',
              }}
            >
              {inviteUrls.general}
            </code>
          </div>
        </div>

        <button
          onClick={() => navigate('/app-admin/circles')}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '12px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          サークル一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>サークル追加</h1>
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #eee',
        }}
      >
        <label
          style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}
        >
          サークル名
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：軽音部"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '1em',
            marginBottom: '20px',
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
          }}
        >
          {loading ? '作成中...' : 'サークルを作成する'}
        </button>
      </div>
    </div>
  );
};
