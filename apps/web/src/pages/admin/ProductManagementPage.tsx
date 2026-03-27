import { Link } from 'react-router-dom';
import { useState } from 'react';

// ダミーの商品データ
const initialProducts = [
  { id: '1', name: '焼きそば', price: 500 },
  { id: '2', name: 'たこ焼き', price: 400 },
];

export const ProductManagementPage = () => {
  const [products] = useState(initialProducts); // SetProductsを未使用のため除去
  const [sessionName, setSessionName] = useState('2026年 学園祭 焼きそば屋台');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #333',
          paddingBottom: '10px',
          marginBottom: '30px',
        }}
      >
        <h1 style={{ margin: 0 }}>商品・セッション管理</h1>
        <Link to="/admin" style={{ color: '#666', textDecoration: 'none' }}>
          &lt; ダッシュボードに戻る
        </Link>
      </div>

      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ fontSize: '1.2em', marginTop: 0 }}>セッション情報設定</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label htmlFor="sessionName" style={{ fontWeight: 'bold' }}>
            イベント・屋台名
          </label>
          <input
            id="sessionName"
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '1.1em',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            style={{
              padding: '10px 20px',
              background: '#1a73e8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-start',
              marginTop: '10px',
            }}
          >
            設定を保存
          </button>
        </div>
      </div>

      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
          }}
        >
          <h2 style={{ fontSize: '1.2em', margin: 0 }}>
            販売商品・割引券 登録
          </h2>
          <button
            style={{
              padding: '8px 16px',
              background: '#34a853',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            + 新規追加
          </button>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <thead style={{ background: '#f1f3f4' }}>
            <tr>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid #ddd',
                }}
              >
                商品名
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  borderBottom: '2px solid #ddd',
                }}
              >
                価格
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'center',
                  borderBottom: '2px solid #ddd',
                }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{p.name}</td>
                <td style={{ padding: '12px' }}>¥{p.price}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    style={{
                      padding: '6px 12px',
                      margin: '0 4px',
                      border: '1px solid #ccc',
                      background: 'white',
                      borderRadius: '4px',
                    }}
                  >
                    編集
                  </button>
                  <button
                    style={{
                      padding: '6px 12px',
                      margin: '0 4px',
                      border: '1px solid #dc3545',
                      color: '#dc3545',
                      background: 'white',
                      borderRadius: '4px',
                    }}
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
