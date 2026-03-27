import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const LoginPage = () => {
  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // ログイン成功後にどこにリダイレクトするか
        redirectTo: `${window.location.origin}/admin`
      }
    });

    if (error) {
      alert('ログインに失敗しました: ' + error.message);
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a73e8' }}>Rejogi ログイン</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
          <button 
            onClick={() => handleOAuthLogin('google')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: 'white', color: '#333', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Googleでログイン
          </button>

          <button 
            onClick={() => handleOAuthLogin('github')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#24292e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" style={{ width: '20px', height: '20px', filter: 'invert(1)' }} />
            GitHubでログイン
          </button>
        </div>

        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '30px' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd' }} />
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '0 10px', color: '#999', fontSize: '0.9em' }}>またはモック（テスト用）</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link 
            to="/admin" 
            style={{ display: 'block', padding: '15px', background: '#34a853', color: 'white', textAlign: 'center', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            管理者としてログイン (Mock)
          </Link>
          <Link 
            to="/" 
            style={{ display: 'block', padding: '15px', background: '#1a73e8', color: 'white', textAlign: 'center', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
          >
            一般スタッフとしてログイン (Mock)
          </Link>
        </div>
      </div>
    </div>
  );
};