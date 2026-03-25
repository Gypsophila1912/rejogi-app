import { Link } from 'react-router-dom';

export const SuccessPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        borderRadius: '50%', 
        background: '#e6f4ea', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '24px'
      }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#34a853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      
      <h1 style={{ fontSize: '2em', marginBottom: '10px', color: '#333' }}>決済完了</h1>
      <p style={{ color: '#666', marginBottom: '40px', fontSize: '1.2em' }}>
        お買い上げありがとうございました。
      </p>

      <Link 
        to="/" 
        style={{
          display: 'inline-block',
          padding: '16px 40px',
          background: '#1a73e8',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '1.2em',
          boxShadow: '0 4px 6px rgba(26, 115, 232, 0.2)'
        }}
      >
        次の注文へ進む
      </Link>
    </div>
  );
};
