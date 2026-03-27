import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [hasActiveSession, setHasActiveSession] = useState(false);

  useEffect(() => {
    // サーバーからセッションの有効状態を取得する（APIが未実装の場合はモックへフォールバック）
    const fetchActiveSession = async () => {
      try {
        const res = await fetch('http://localhost:3000/sessions/active');
        if (res.ok) {
          const data = await res.json();
          setHasActiveSession(data.isActive);
        } else {
          console.warn('API returned non-OK. Using mocked status.');
          setHasActiveSession(true);
        }
      } catch (error) {
        console.error('API fetch failed, fallback to active=true for development:', error);
        setHasActiveSession(true);
      }
    };
    
    fetchActiveSession();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>      
      <header style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>   
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '2em' }}>ダッシュボード（管理用）</h1>
          <div>
            <span style={{ marginRight: '15px', color: '#666' }}>ログイン中: {user?.email || '管理者'}</span>
            <Link to="/" style={{ color: '#1a73e8', textDecoration: 'none', fontWeight: 'bold' }}>レジ画面へ移動 &rarr;</Link>
          </div>
        </div>
      </header>

      {/* セッション状態のトグル（モック確認用） */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#fff3cd', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ display: 'block', marginBottom: '5px' }}>今年度のセッション（屋台・イベント）</strong>
          <span style={{ color: hasActiveSession ? '#137333' : '#b31412', fontWeight: 'bold' }}>
            {hasActiveSession ? '✓ 作成済み（各種操作が可能です）' : '未作成（先にセッションを作成してください）'}
          </span>
        </div>
        {import.meta.env.DEV && (
          <button
            onClick={() => setHasActiveSession(!hasActiveSession)}
            style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            状態を切り替える(テスト用)
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>

        {/* 商品・セッション管理 */}
        <Link
          to="/admin/products"
          style={{
            display: 'block',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            color: '#333',
            border: '1px solid #eee',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', color: '#1a73e8' }}>📦 商品・セッション管理</h2>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.5 }}>年度や屋台名 の設定、販売する商品や割引券の登録・編集を行います。</p>
        </Link>

        {/* 売上まとめ */}
        <Link
          to={hasActiveSession ? "/admin/sales" : "#"}
          aria-disabled={!hasActiveSession}
          tabIndex={!hasActiveSession ? -1 : undefined}
          onClick={!hasActiveSession ? (e) => e.preventDefault() : undefined}   
          style={{
            display: 'block',
            padding: '30px',
            background: hasActiveSession ? 'white' : '#f5f5f5',
            borderRadius: '12px',
            textDecoration: 'none',
            color: hasActiveSession ? '#333' : '#999',
            border: '1px solid #eee',
            boxShadow: hasActiveSession ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            opacity: hasActiveSession ? 1 : 0.6,
            pointerEvents: hasActiveSession ? 'auto' : 'none'
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', color: hasActiveSession ? '#34a853' : '#999' }}>📈 売上まとめ</h2>
          <p style={{ margin: 0, color: hasActiveSession ? '#666' : '#999', lineHeight: 1.5 }}>現在の総売上、販売個数などの集計データを確認します。</p>
        </Link>

        {/* メンバー管理 */}
        <Link
          to={hasActiveSession ? "/admin/members" : "#"}
          aria-disabled={!hasActiveSession}
          tabIndex={!hasActiveSession ? -1 : undefined}
          onClick={!hasActiveSession ? (e) => e.preventDefault() : undefined}   
          style={{
            display: 'block',
            padding: '30px',
            background: hasActiveSession ? 'white' : '#f5f5f5',
            borderRadius: '12px',
            textDecoration: 'none',
            color: hasActiveSession ? '#333' : '#999',
            border: '1px solid #eee',
            boxShadow: hasActiveSession ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
            opacity: hasActiveSession ? 1 : 0.6,
            pointerEvents: hasActiveSession ? 'auto' : 'none'
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', color: hasActiveSession ? '#fbbc04' : '#999' }}>👥 メンバー管理</h2>
          <p style={{ margin: 0, color: hasActiveSession ? '#666' : '#999', lineHeight: 1.5 }}>現在ログインしているスタッフの確認や権限の管理を行います。</p>   
        </Link>

        {/* 履歴 */}
        <Link
          to="/admin/history"
          style={{
            display: 'block',
            padding: '30px',
            background: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            color: '#333',
            border: '1px solid #eee',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', color: '#ea4335' }}>🕰️ 履歴・過去 データ</h2>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.5 }}>過去の年度・ セッションごとの取引詳細や履歴を閲覧します。</p>
        </Link>

      </div>
    </div>
  );
};
