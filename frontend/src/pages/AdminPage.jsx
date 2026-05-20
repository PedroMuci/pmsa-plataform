import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serversService, gamesService } from '../services/api';

import logoImg from '../assets/PMSA-logo.png';

export default function AdminPage() {
  const navigate = useNavigate();
  const [clusterInfo, setClusterInfo] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      serversService.getClusterInfo(),
      gamesService.getAll()
    ]).then(([clusterRes, gamesRes]) => {
      setClusterInfo(clusterRes.data);
      setGames(gamesRes.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalServers = games.reduce((acc, g) => acc + g.servers_online, 0);
  const totalPlayers = games.reduce((acc, g) => acc + g.players_online, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>

      {/* Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        background: '#111',
        borderBottom: '1px solid #222'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={logoImg}
            alt="PMSA"
            style={{ height: '40px' }}
          />

          <span style={{
            color: '#ff6b00',
            fontWeight: 'bold',
            fontSize: '14px',
            letterSpacing: '2px'
          }}>
            ADMIN DASHBOARD
          </span>
        </div>

        <button
          onClick={() => navigate('/games')}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: '6px',
            color: '#aaa',
            cursor: 'pointer'
          }}
        >
          ← Voltar
        </button>
      </header>

      <div style={{ padding: '40px' }}>

        {/* Title */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ margin: 0 }}>
            Painel <span style={{ color: '#ff6b00' }}>Administrativo</span>
          </h1>

          <button
            onClick={fetchData}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#aaa',
              cursor: 'pointer'
            }}
          >
            ↻ Atualizar
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#666' }}>Carregando...</p>
        ) : (
          <>
            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginBottom: '40px'
            }}>
              {[
                {
                  label: 'SERVIDORES ONLINE',
                  value: totalServers,
                  color: '#ff6b00'
                },
                {
                  label: 'JOGADORES ONLINE',
                  value: totalPlayers,
                  color: '#00cc66'
                },
                {
                  label: 'JOGOS DISPONÍVEIS',
                  value: games.length,
                  color: '#3399ff'
                }
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: '10px',
                    padding: '24px',
                    textAlign: 'center'
                  }}
                >
                  <p style={{
                    color: '#666',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    margin: '0 0 8px'
                  }}>
                    {item.label}
                  </p>

                  <p style={{
                    color: item.color,
                    fontSize: '36px',
                    fontWeight: 'bold',
                    margin: 0
                  }}>
                    {item.value ?? 0}
                  </p>
                </div>
              ))}
            </div>

            {/* Games Status */}
            <div>
              <h2 style={{ marginBottom: '16px' }}>
                Status por Jogo
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px'
              }}>
                {games.map(game => (
                  <div
                    key={game.name}
                    style={{
                      background: '#111',
                      border: '1px solid #222',
                      borderRadius: '10px',
                      padding: '20px'
                    }}
                  >
                    <h3 style={{
                      margin: '0 0 16px',
                      fontSize: '16px'
                    }}>
                      {game.display_name}
                    </h3>

                    <p style={{
                      margin: '4px 0',
                      color: '#666',
                      fontSize: '13px'
                    }}>
                      Servidores:{' '}
                      <span style={{ color: '#ff6b00' }}>
                        {game.servers_online}
                      </span>
                    </p>

                    <p style={{
                      margin: '4px 0',
                      color: '#666',
                      fontSize: '13px'
                    }}>
                      Jogadores:{' '}
                      <span style={{ color: '#fff' }}>
                        {game.players_online}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}