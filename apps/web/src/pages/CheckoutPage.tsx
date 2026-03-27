import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useQueueStore } from '../store/queueStore';

export const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const addOrderToQueue = useQueueStore((state) => state.addOrderToQueue);
  const [receivedAmount, setReceivedAmount] = useState<number | ''>('');
  const [addToQueue, setAddToQueue] = useState(false);
  const navigate = useNavigate();

  const total = getTotalPrice();
  const effectiveTotal = Math.max(total, 0); // 割引などでマイナスになっても最低支払額は0円とする
  const change =
    typeof receivedAmount === 'number' ? receivedAmount - effectiveTotal : 0;
  const isSufficient =
    typeof receivedAmount === 'number' && receivedAmount >= effectiveTotal;

  // 10キー系の入力処理
  const handleNumpad = (num: string) => {
    setReceivedAmount((prev) => {
      const prevString = prev === '' ? '' : prev.toString();
      if (prevString === '0' && num !== '0') return parseInt(num, 10);
      if (prevString === '0' && num === '0') return 0;
      return parseInt(prevString + num, 10);
    });
  };

  const handleClear = () => setReceivedAmount('');
  const handleExactAmount = () => setReceivedAmount(total);

  const handleComplete = () => {
    if (isSufficient) {
      let assignedNumber = null;
      if (addToQueue) {
        assignedNumber = addOrderToQueue(cart);
      }
      clearCart();
      navigate('/success', { state: { queueNumber: assignedNumber } });
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>カートに商品がありません</h2>
        <Link to="/">レジへ戻る</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '2px solid #333',
          paddingBottom: '10px',
        }}
      >
        <h1 style={{ margin: 0 }}>会計画面</h1>
        <Link to="/" style={{ color: '#666', textDecoration: 'none' }}>
          &lt; 戻る
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          marginTop: '20px',
        }}
      >
        {/* 注文明細 */}
        <div>
          <h2
            style={{ fontSize: '1.2em', color: '#555', marginBottom: '10px' }}
          >
            注文明細
          </h2>
          <div
            style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '12px',
            }}
          >
            {cart.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  fontSize: '1.1em',
                }}
              >
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>
                  ¥{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <hr
              style={{
                margin: '20px 0',
                border: 'none',
                borderTop: '2px dashed #ccc',
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.5em',
                fontWeight: 'bold',
              }}
            >
              <span>合計</span>
              <span style={{ color: '#d93025' }}>
                ¥{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* 決済入力（電卓風） */}
        <div>
          <div style={{ marginBottom: '15px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: '#fff',
                border: '2px solid #ccc',
                borderRadius: '8px',
                fontSize: '1.4em',
              }}
            >
              <span>お預かり</span>
              <span style={{ fontWeight: 'bold' }}>
                {receivedAmount === ''
                  ? '¥0'
                  : `¥${receivedAmount.toLocaleString()}`}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                background: '#e6f4ea',
                borderRadius: '8px',
                fontSize: '1.4em',
              }}
            >
              <span>おつり</span>
              <span
                style={{
                  fontWeight: 'bold',
                  color: change >= 0 ? '#137333' : '#d93025',
                }}
              >
                {receivedAmount === ''
                  ? '---'
                  : change < 0
                    ? '不足'
                    : `¥${change.toLocaleString()}`}
              </span>
            </div>
          </div>

          {/* 右列の10キーパッドなどを全体幅で使用 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumpad(num)}
                style={{
                  padding: '20px',
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  background: '#f1f3f4',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              style={{
                padding: '20px',
                fontSize: '1.2em',
                fontWeight: 'bold',
                background: '#fad2cf',
                color: '#b31412',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              C
            </button>
            <button
              onClick={() => handleNumpad('0')}
              style={{
                padding: '20px',
                fontSize: '1.5em',
                fontWeight: 'bold',
                background: '#f1f3f4',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              0
            </button>
            <button
              onClick={() => handleNumpad('00')}
              style={{
                padding: '20px',
                fontSize: '1.5em',
                fontWeight: 'bold',
                background: '#f1f3f4',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              00
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={handleExactAmount}
              style={{
                flex: 1,
                padding: '15px',
                fontSize: '1.2em',
                background: '#fff',
                border: '2px solid #1a73e8',
                color: '#1a73e8',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              ちょうど預かる
            </button>
          </div>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
              fontSize: '1.2em',
              cursor: 'pointer',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #ddd',
            }}
          >
            <input
              type="checkbox"
              checked={addToQueue}
              onChange={(e) => setAddToQueue(e.target.checked)}
              style={{ width: '24px', height: '24px', cursor: 'pointer' }}
            />
            <span>会計後に引換待機列へ追加する</span>
          </label>

          <button
            onClick={handleComplete}
            disabled={!isSufficient}
            style={{
              width: '100%',
              padding: '20px',
              fontSize: '1.5em',
              fontWeight: 'bold',
              background: isSufficient ? '#1a73e8' : '#e0e0e0',
              color: isSufficient ? 'white' : '#9e9e9e',
              border: 'none',
              borderRadius: '8px',
              cursor: isSufficient ? 'pointer' : 'not-allowed',
            }}
          >
            決済完了
          </button>
        </div>
      </div>
    </div>
  );
};
