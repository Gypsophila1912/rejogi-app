import { Link } from 'react-router-dom';

export const AppAdminDashboardPage = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px' }}>アプリ管理者ダッシュボード</h1>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <Link to="/app-admin/circles" style={cardStyle}>
          <h2 style={{ color: '#1a73e8' }}>🏫 サークル管理</h2>
          <p style={{ color: '#666' }}>サークルの追加・招待URL確認</p>
        </Link>
        <Link to="/app-admin/members" style={cardStyle}>
          <h2 style={{ color: '#34a853' }}>👥 メンバー管理</h2>
          <p style={{ color: '#666' }}>全ユーザーの一覧・権限確認</p>
        </Link>
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '30px',
  background: 'white',
  borderRadius: '12px',
  textDecoration: 'none',
  color: '#333',
  border: '1px solid #eee',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};
