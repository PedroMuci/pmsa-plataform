import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gamesService, serversService } from '../services/api';

import minecraftImg from '../assets/minecraft.png';
import csImg from '../assets/cs.jpg';
import fortniteImg from '../assets/fortnite.jpg';
import rocketleagueImg from '../assets/rocketleague.jpg';

const GAME_NAMES = {
  minecraft: 'Minecraft',
  cs: 'Counter-Strike',
  fortnite: 'Fortnite',
  rocketleague: 'Rocket League'
};

const GAME_IMAGES = {
  minecraft: minecraftImg,
  cs: csImg,
  fortnite: fortniteImg,
  rocketleague: rocketleagueImg
};

export default function ServerPage() {
  const { game } = useParams();
  const navigate = useNavigate();
  const [gameInfo, setGameInfo] = useState(null);
  const [servers, setServers] = useState([]);
  const [connection, setConnection] = useState(null);
  const [existingConnection, setExistingConnection] = useState(null);
  const [activeTab, setActiveTab] = useState('matchmaking');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    gamesService.getOne(game).then(res => setGameInfo(res.data));
    fetchServers();
    checkExistingConnection();
  }, [game]);

  const checkExistingConnection = async () => {
    try {
      const res = await serversService.getMyConnection();
      if (res.data) {
        if (res.data.server.game === game) {
          setConnection(res.data);
        } else {
          setExistingConnection(res.data);
        }
      }
    } catch {
      setConnection(null);
      setExistingConnection(null);
    }
  };

  const fetchServers = () => {
    serversService.getGameServers(game)
      .then(res => setServers(res.data))
      .catch(console.error);
  };

  const handleMatchmaking = async () => {
    if (existingConnection) {
      setShowConfirmModal(true);
      return;
    }
    await doMatchmaking();
  };

  const doMatchmaking = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    setMessage('');
    try {
      if (existingConnection) {
        await serversService.disconnect();
        setExistingConnection(null);
      }
      const res = await serversService.matchmaking(game);
      setConnection(res.data);
      setMessage(`✅ Conectado ao servidor: ${res.data.server.name}`);
      fetchServers();
    } catch (err) {
      setMessage('❌ Erro ao buscar servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await serversService.disconnect();
      setConnection(null);
      setExistingConnection(null);
      setMessage('Desconectado com sucesso');
      fetchServers();
    } catch {
      setMessage('❌ Erro ao desconectar');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>

      {/* Modal de confirmação */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#111', border: '1px solid #ff6b00',
            borderRadius: '12px', padding: '32px', maxWidth: '440px', width: '90%'
          }}>
            <h3 style={{ color: '#ff6b00', margin: '0 0 16px' }}>⚠️ Já conectado</h3>
            <p style={{ color: '#ccc', margin: '0 0 24px', lineHeight: '1.6' }}>
              Você já está conectado ao servidor <strong style={{ color: '#fff' }}>
                {existingConnection?.server?.name}
              </strong> ({GAME_NAMES[existingConnection?.server?.game] || existingConnection?.server?.game}). Deseja se desconectar e entrar em um novo servidor de <strong style={{ color: '#ff6b00' }}>{GAME_NAMES[game]}</strong>?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={doMatchmaking} style={{
                flex: 1, padding: '12px', background: '#ff6b00', border: 'none',
                borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer'
              }}>
                SIM, TROCAR
              </button>
              <button onClick={() => setShowConfirmModal(false)} style={{
                flex: 1, padding: '12px', background: 'transparent',
                border: '1px solid #333', borderRadius: '8px',
                color: '#aaa', cursor: 'pointer'
              }}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      <div style={{ position: 'relative', height: '280px' }}>
        <img
          src={GAME_IMAGES[game]}
          alt={game}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,10,1) 100%)'
        }} />
        <div style={{ position: 'absolute', bottom: '24px', left: '40px' }}>
          <button onClick={() => navigate('/games')} style={{
            background: 'transparent', border: 'none', color: '#aaa',
            cursor: 'pointer', fontSize: '14px', marginBottom: '8px', padding: 0
          }}>← Voltar</button>
          <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 'bold' }}>
            {GAME_NAMES[game] || game}
          </h1>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <span style={{ color: '#ff6b00' }}>🟢 {gameInfo?.servers_online || 0} servidores</span>
            <span style={{ color: '#aaa' }}>👥 {gameInfo?.players_online || 0} jogadores</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #222', padding: '0 40px' }}>
        {['matchmaking', 'servers'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '16px 24px', background: 'transparent', border: 'none',
            color: activeTab === tab ? '#ff6b00' : '#666', cursor: 'pointer',
            fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px',
            borderBottom: activeTab === tab ? '2px solid #ff6b00' : '2px solid transparent'
          }}>
            {tab === 'matchmaking' ? 'BUSCAR SERVIDOR' : 'ESTADO DOS SERVIDORES'}
          </button>
        ))}
      </div>

      <div style={{ padding: '40px' }}>
        {activeTab === 'matchmaking' && (
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ marginTop: 0 }}>Matchmaking Automático</h2>
            <p style={{ color: '#666' }}>
              O sistema irá encontrar um servidor disponível ou criar um novo automaticamente.
            </p>

            {connection ? (
              <div style={{
                background: '#111', border: '1px solid #ff6b00',
                borderRadius: '12px', padding: '24px', marginBottom: '24px'
              }}>
                <h3 style={{ color: '#ff6b00', margin: '0 0 16px' }}>✅ Conectado</h3>
                <p style={{ margin: '4px 0', color: '#ccc' }}>
                  <strong style={{ color: '#fff' }}>Servidor:</strong> {connection.server.name}
                </p>
                <p style={{ margin: '4px 0', color: '#ccc' }}>
                  <strong style={{ color: '#fff' }}>Jogadores:</strong> {connection.server.current_players}/{connection.server.max_players}
                </p>
                <button onClick={handleDisconnect} style={{
                  marginTop: '16px', padding: '10px 24px',
                  background: '#333', border: '1px solid #555',
                  borderRadius: '6px', color: '#fff', cursor: 'pointer'
                }}>
                  DESCONECTAR
                </button>
              </div>
            ) : (
              <button onClick={handleMatchmaking} disabled={loading} style={{
                padding: '16px 40px', background: '#ff6b00', border: 'none',
                borderRadius: '8px', color: '#fff', fontSize: '16px',
                fontWeight: 'bold', cursor: 'pointer', opacity: loading ? 0.7 : 1
              }}>
                {loading ? 'BUSCANDO...' : '🎮 BUSCAR SERVIDOR'}
              </button>
            )}

            {message && (
              <p style={{ color: '#aaa', marginTop: '16px' }}>{message}</p>
            )}
          </div>
        )}

        {activeTab === 'servers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0 }}>Servidores Online</h2>
              <button onClick={fetchServers} style={{
                padding: '8px 16px', background: 'transparent',
                border: '1px solid #333', borderRadius: '6px',
                color: '#aaa', cursor: 'pointer'
              }}>↻ Atualizar</button>
            </div>

            {servers.length === 0 ? (
              <p style={{ color: '#666' }}>Nenhum servidor online no momento.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {servers.map(server => (
                  <div key={server.id} style={{
                    background: '#111', border: '1px solid #222',
                    borderRadius: '10px', padding: '20px',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'
                  }}>
                    <div>
                      <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>SERVIDOR</p>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>{server.name}</p>
                    </div>
                    <div>
                      <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>JOGADORES</p>
                      <p style={{ margin: 0, color: '#ff6b00', fontWeight: 'bold' }}>
                        {server.current_players}/{server.max_players}
                      </p>
                    </div>
                    <div>
                      <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>UPTIME</p>
                      <p style={{ margin: 0, fontSize: '13px', color: '#00cc66' }}>{server.uptime || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}