import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gamesService } from '../services/api';

import logoImg from '../assets/PMSA-logo.png';
import minecraftImg from '../assets/minecraft.png';
import csImg from '../assets/cs.jpg';
import fortniteImg from '../assets/fortnite.jpg';
import rocketleagueImg from '../assets/rocketleague.jpg';

const gameImages = {
  minecraft: minecraftImg,
  cs: csImg,
  fortnite: fortniteImg,
  rocketleague: rocketleagueImg
};

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    gamesService.getAll()
      .then(res => setGames(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px', background: '#111', borderBottom: '1px solid #222'
      }}>
        <img
          src={logoImg}
          alt="PMSA" style={{ height: '40px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ color: '#888' }}>Olá, <span style={{ color: '#ff6b00', fontWeight: 'bold' }}>{user?.username}</span></span>
          <button onClick={() => navigate('/admin')} style={{
            padding: '8px 16px', background: 'transparent', border: '1px solid #ff6b00',
            borderRadius: '6px', color: '#ff6b00', cursor: 'pointer', fontSize: '13px'
          }}>ADMIN</button>
          <button onClick={logout} style={{
            padding: '8px 16px', background: '#ff6b00', border: 'none',
            borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'
          }}>SAIR</button>
        </div>
      </header>

      {/* Title */}
      <div style={{ padding: '48px 40px 24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
          Selecione um <span style={{ color: '#ff6b00' }}>Jogo</span>
        </h1>
        <p style={{ color: '#666', marginTop: '8px' }}>Escolha um servidor para entrar</p>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#666' }}>Carregando...</div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px', padding: '0 40px 40px'
        }}>
          {games.map(game => (
            <GameCard key={game.name} game={game} onClick={() => navigate(`/servers/${game.name}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function GameCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', borderRadius: '12px', overflow: 'hidden',
        cursor: 'pointer', height: '260px',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease',
        border: hovered ? '2px solid #ff6b00' : '2px solid transparent'
      }}
    >
      <img
        src={gameImages[game.name]}
        alt={game.display_name}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 100%)'
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 'bold' }}>
          {game.display_name}
        </h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: '#ff6b00', fontSize: '13px' }}>
            🟢 {game.servers_online} servidores online
          </span>
          <span style={{ color: '#aaa', fontSize: '13px' }}>
            👥 {game.players_online} jogadores
          </span>
        </div>
        {hovered && (
          <button style={{
            marginTop: '12px', padding: '10px 24px',
            background: '#ff6b00', border: 'none', borderRadius: '6px',
            color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
          }}>
            JOGAR AGORA →
          </button>
        )}
      </div>
    </div>
  )
}