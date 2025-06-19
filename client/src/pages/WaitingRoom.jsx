import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import '../styles/WaitingRoom.css';

const socket = io('http://localhost:3001'); // Cambia el puerto si es necesario

export default function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gameId } = location.state || {};
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!gameId) return;
    socket.emit('joinGame', gameId);

    socket.on('waitingRoomUpdate', (playersList) => {
      setPlayers(playersList);
    });

    return () => {
      socket.off('waitingRoomUpdate');
    };
  }, [gameId]);

  return (
    <div className="waiting-bg">
      <div className="waiting-panel">
        <h1 className="waiting-title">Sala de Espera</h1>
        <p className="waiting-subtitle">Jugadores en la partida:</p>
        <ul className="waiting-list">
          {players.map((p, idx) => (
            <li key={idx} className="waiting-player">
              <span className="waiting-vehicle">
                {p.vehicle === 'Rojo' && '🚗'}
                {p.vehicle === 'Azul' && '🚙'}
                {p.vehicle === 'Verde' && '🛺'}
                {p.vehicle === 'Amarillo' && '🏎️'}
              </span>
              <span className="waiting-nickname">{p.nickName}</span>
            </li>
          ))}
        </ul>
        <div className="waiting-message">
          Esperando a que se unan más jugadores...
        </div>
      </div>
    </div>
  );
}