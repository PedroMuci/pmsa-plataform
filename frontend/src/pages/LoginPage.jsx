import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logoImg from '../assets/PMSA-logo.png';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate('/games');
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#111', border: '1px solid #222',
        borderRadius: '12px', padding: '48px', width: '400px'
      }}>
        <img
          src={logoImg}
          alt="PMSA"
          style={{ width: '180px', marginBottom: '32px', display: 'block', margin: '0 auto 32px' }}
        />

        <div style={{ display: 'flex', marginBottom: '32px', background: '#0a0a0a', borderRadius: '8px', padding: '4px' }}>
          <button onClick={() => setIsLogin(true)} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            background: isLogin ? '#ff6b00' : 'transparent',
            color: isLogin ? '#fff' : '#666', fontWeight: 'bold', transition: 'all 0.2s'
          }}>LOGIN</button>
          <button onClick={() => setIsLogin(false)} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            background: !isLogin ? '#ff6b00' : 'transparent',
            color: !isLogin ? '#fff' : '#666', fontWeight: 'bold', transition: 'all 0.2s'
          }}>CADASTRO</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            type="text" placeholder="Nome de usuário" value={username}
            onChange={e => setUsername(e.target.value)} required
            style={{
              padding: '14px', background: '#0a0a0a', border: '1px solid #333',
              borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none'
            }}
          />
          <input
            type="password" placeholder="Senha" value={password}
            onChange={e => setPassword(e.target.value)} required
            style={{
              padding: '14px', background: '#0a0a0a', border: '1px solid #333',
              borderRadius: '8px', color: '#fff', fontSize: '15px', outline: 'none'
            }}
          />
          {error && <p style={{ color: '#ff4444', fontSize: '14px', margin: 0 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: '14px', background: '#ff6b00', border: 'none',
            borderRadius: '8px', color: '#fff', fontSize: '16px',
            fontWeight: 'bold', cursor: 'pointer', marginTop: '8px',
            opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
          }}>
            {loading ? 'AGUARDE...' : isLogin ? 'ENTRAR' : 'CRIAR CONTA'}
          </button>
        </form>
      </div>
    </div>
  );
}