import { Link } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a73e8' }}>Rejogi ログイン</h1>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ユーザーID / Email</label>
            <input type="text" placeholder="user@example.com" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>パスワード</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 今回はモックなので、リンクで強制的に画面遷移させます */}
          <Link 
            to="/admin" 
            style={{ display: 'block', padding: '15px', background: '#34a853', color: 'white', textAlign: 'center', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            管理者としてログイン
          </Link>
          <Link 
            to="/" 
            style={{ display: 'block', padding: '15px', background: '#1a73e8', color: 'white', textAlign: 'center', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            一般スタッフとしてログイン (レジへ)
          </Link>
        </div>
      </div>
    </div>
  );
};