import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ダミーデータ：今年度のセッションが作成されているかどうかの状態
// false にすると各管理機能がグレーアウトされます
const DUMMY_HAS_ACTIVE_SESSION = true;

// 認証トークンのダミーチェック用 (将来的にはこの判定を Context や API 呼び出しに置き換えます)
const IS_AUTHENTICATED_MOCK = true; // false にするとログイン画面へリダイレクトされます

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [hasActiveSession, setHasActiveSession] = useState(
    DUMMY_HAS_ACTIVE_SESSION,
  );

  useEffect(() => {
    // 【将来の実装想定】ここでlocalStorageのトークン確認や、APIでの権限チェックを行う
    // const token = localStorage.getItem('auth_token');
    // if (!token) { navigate('/login'); }

    if (!IS_AUTHENTICATED_MOCK) {
      alert('権限がありません。ログインしてください。');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          borderBottom: '2px solid #333',
          paddingBottom: '15px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '2em' }}>
            ダッシュボード（管理用）
          </h1>
          <div>
            <span style={{ marginRight: '15px', color: '#666' }}>
              ログイン中: 管理者
            </span>
            <Link
              to="/"
              style={{
                color: '#1a73e8',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              レジ画面へ移動 &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* セッション状態のトグル（モック確認用） */}
      <div
        style={{
          marginBottom: '30px',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong style={{ display: 'block', marginBottom: '5px' }}>
            今年度のセッション（屋台・イベント）
          </strong>
          <span
            style={{
              color: hasActiveSession ? '#137333' : '#b31412',
              fontWeight: 'bold',
            }}
          >
            {hasActiveSession
              ? '✓ 作成済み（各種操作が可能です）'
              : '未作成（先にセッションを作成してください）'}
          </span>
        </div>
        <button
          onClick={() => setHasActiveSession(!hasActiveSession)}
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
        >
          状態を切り替える(テスト用)
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
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
          <h2 style={{ margin: '0 0 10px 0', color: '#1a73e8' }}>
            📦 商品・セッション管理
          </h2>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.5 }}>
            年度や屋台名の設定、販売する商品や割引券の登録・編集を行います。
          </p>
        </Link>

        {/* 売上まとめ */}
        <Link
          to={hasActiveSession ? '/admin/sales' : '#'}
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
            pointerEvents: hasActiveSession ? 'auto' : 'none',
          }}
        >
          <h2
            style={{
              margin: '0 0 10px 0',
              color: hasActiveSession ? '#34a853' : '#999',
            }}
          >
            📈 売上まとめ
          </h2>
          <p
            style={{
              margin: 0,
              color: hasActiveSession ? '#666' : '#999',
              lineHeight: 1.5,
            }}
          >
            現在の総売上、販売個数などの集計データを確認します。
          </p>
        </Link>

        {/* メンバー管理 */}
        <Link
          to={hasActiveSession ? '/admin/members' : '#'}
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
            pointerEvents: hasActiveSession ? 'auto' : 'none',
          }}
        >
          <h2
            style={{
              margin: '0 0 10px 0',
              color: hasActiveSession ? '#fbbc04' : '#999',
            }}
          >
            👥 メンバー管理
          </h2>
          <p
            style={{
              margin: 0,
              color: hasActiveSession ? '#666' : '#999',
              lineHeight: 1.5,
            }}
          >
            現在ログインしているスタッフの確認や権限の管理を行います。
          </p>
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
          <h2 style={{ margin: '0 0 10px 0', color: '#ea4335' }}>
            🕰️ 履歴・過去データ
          </h2>
          <p style={{ margin: 0, color: '#666', lineHeight: 1.5 }}>
            過去の年度・セッションごとの取引詳細や履歴を閲覧します。
          </p>
        </Link>
      </div>
    </div>
  );
};
