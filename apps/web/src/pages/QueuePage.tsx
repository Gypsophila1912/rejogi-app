import { useQueueStore } from '../store/queueStore';

export const QueuePage = () => {
  const { orders, removeOrder } = useQueueStore();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>引換待機列</h1>
      
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '60px', color: '#666', fontSize: '1.2em' }}>
          現在待機中の注文はありません
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              border: '2px solid #e0e0e0', 
              borderRadius: '12px', 
              padding: '20px', 
              background: 'white', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '1.2em', color: '#555' }}>待機番号</span>
                <span style={{ fontSize: '3em', fontWeight: 'bold', color: '#1a73e8', lineHeight: 1 }}>{order.queueNumber}</span>
              </div>
              
              <div style={{ flexGrow: 1, marginBottom: '20px' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '1.2em' }}>
                    <span>{item.product.name}</span>
                    <span style={{ fontWeight: 'bold' }}>× {item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => removeOrder(order.id)}
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  background: '#34a853', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '1.2em', 
                  fontWeight: 'bold', 
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2d8c44'}
                onMouseOut={(e) => e.currentTarget.style.background = '#34a853'}
              >
                商品お渡し完了
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
