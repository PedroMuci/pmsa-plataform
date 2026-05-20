import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logoImg from '../assets/PMSA-logo.png';

export default function SplashPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        if (user) {
          navigate('/games');
        } else {
          navigate('/login');
        }
      }, 2500);
    }
  }, [loading, user]);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px'
    }}>
      <img
        src={logoImg}
        alt="PMSA Logo"
        style={{ width: '320px', animation: 'fadeIn 1s ease-in' }}
      />
      <div style={{
        width: '200px',
        height: '3px',
        background: '#1a1a1a',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: '#ff6b00',
          animation: 'loading 2.5s ease-in-out forwards'
        }} />
      </div>
      <p style={{ color: '#666', fontSize: '14px', letterSpacing: '2px' }}>
        CARREGANDO...
      </p>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}