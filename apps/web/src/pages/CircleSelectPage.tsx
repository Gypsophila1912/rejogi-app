import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const CircleSelectPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const circles = profile?.circle_members?.map((cm) => cm.circles) || [];

  const handleSelect = (circleId: string) => {
    sessionStorage.setItem('active_circle_id', circleId);
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a73e8' }}>サークルを選択</h1>
        
        {circles.length === 0 ? (
          <p style={{ textAlign: 'center' }}>所属しているサークルがありません。</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {circles.map((circle) => (
              <button
                key={circle.id}
                onClick={() => handleSelect(circle.id)}
                style={{
                  padding: '15px',
                  background: '#f8f9fa',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e8f0fe'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f8f9fa'}
              >
                {circle.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
