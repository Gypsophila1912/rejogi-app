import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, type Product } from '../store/cartStore';

// TODO: 後ほどAPIから取得するデータに差し替えます
const DUMMY_PRODUCTS: Product[] = [
  { id: '1', name: '焼きそば', price: 500 },
  { id: '2', name: 'たこ焼き', price: 400 },
  { id: '3', name: 'フランクフルト', price: 300 },
  { id: '4', name: 'りんごあめ', price: 200 },
  { id: '5', name: 'ジュース', price: 150 },
  { id: '6', name: 'お茶', price: 150 },
];

const DUMMY_DISCOUNTS: Product[] = [
  { id: 'd1', name: '50円引き', price: -50 },
  { id: 'd2', name: '100円引き', price: -100 },
  { id: 'd3', name: '200円引き', price: -200 },
];

export const RegisterPage = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'discounts'>('products');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const displayItems = activeTab === 'products' ? DUMMY_PRODUCTS : DUMMY_DISCOUNTS;

  return (
    <div style={{ padding: '20px', paddingBottom: '120px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>レジ画面</h1>
      
      <div style={{ marginTop: '20px' }}>
        
        {/* タブ切り替え */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'products' ? '#1a73e8' : '#e0e0e0',
              color: activeTab === 'products' ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            🍕 商品・メニュー
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '1.2em',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '8px',
              background: activeTab === 'discounts' ? '#1a73e8' : '#e0e0e0',
              color: activeTab === 'discounts' ? 'white' : '#333',
              cursor: 'pointer'
            }}
          >
            🎟️ 割引・クーポン
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '15px' 
        }}>
          {displayItems.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              style={{
                padding: '20px 10px',
                border: '1px solid #ccc',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.1s',
              }}
            >
              <span style={{ fontSize: '1.1em', fontWeight: 'bold', marginBottom: '8px' }}>
                {product.name}
              </span>
              <span style={{ color: product.price < 0 ? '#d93025' : '#0066cc', fontWeight: 'bold' }}>
                {product.price < 0 ? `¥${product.price}` : `¥${product.price}`}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* カート（ボトムシート風） */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        transition: 'transform 0.3s ease-in-out',
        transform: isCartOpen ? 'translateY(0)' : 'translateY(calc(100% - 80px))',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '80vh',
      }}>
        
        {/* ヘッダー部分（常に表示、タップで開閉） */}
        <div 
          onClick={() => setIsCartOpen(!isCartOpen)}
          style={{
            height: '80px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderBottom: isCartOpen ? '1px solid #eee' : 'none',
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
            🛒 カート ({totalItems}点)
            <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#666' }}>
              {isCartOpen ? '▼ 閉じる' : '▲ 開く'}
            </span>
          </div>
          <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#d93025' }}>
            ¥{getTotalPrice().toLocaleString()}
          </div>
        </div>

        {/* カート詳細（開いたときのみ中身が見える） */}
        <div style={{ overflowY: 'auto', padding: '20px', flexGrow: 1, background: '#f8f9fa' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>
              カートに商品がありません
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map((item) => (
                <div key={item.product.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '12px', 
                  background: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #eee'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.product.name}</div>
                    <div style={{ color: '#666', fontSize: '0.9em' }}>¥{item.product.price} × {item.quantity}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                    >-</button>
                    
                    <span style={{ width: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                    
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ccc', background: 'white', cursor: 'pointer' }}
                    >+</button>
                    
                    <button 
                      onClick={() => removeFromCart(item.product.id)} 
                      style={{ marginLeft: '10px', color: '#dc3545', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >削除</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <Link 
              to="/checkout" 
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: cart.length > 0 ? '#1a73e8' : '#ccc',
                color: 'white',
                textAlign: 'center',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1.2em',
                pointerEvents: cart.length > 0 ? 'auto' : 'none'
              }}
            >
              会計へ進む
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
