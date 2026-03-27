import { supabase } from '../../lib/supabase';

export const AppAdminLoginPage = () => {
  const handleLogin = async (provider: 'google' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/app-admin/callback`,
      },
    });

    if (error) {
      alert('ログインに失敗しました: ' + error.message);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f5f5',
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
        <h1 style={{ textAlign: 'center', marginBottom: '8px', color: '#333' }}>
          管理者ログイン
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#999',
            marginBottom: '30px',
            fontSize: '0.9em',
          }}
        >
          アプリ管理者専用
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={() => handleLogin('google')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px',
              background: 'white',
              color: '#333',
              border: '1px solid #ccc',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={{ width: '20px' }}
            />
            Googleでログイン
          </button>
          <button
            onClick={() => handleLogin('github')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px',
              background: '#24292e',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            <img
              src="https://www.svgrepo.com/show/512317/github-142.svg"
              alt="GitHub"
              style={{ width: '20px', filter: 'invert(1)' }}
            />
            GitHubでログイン
          </button>
        </div>
      </div>
    </div>
  );
};
