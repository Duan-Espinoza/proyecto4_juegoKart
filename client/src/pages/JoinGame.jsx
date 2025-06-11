import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinGame.css';
import axios from 'axios';

export default function JoinGame() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem('nickname') || 'Invitado';
  const [partidas, setPartidas] = useState([]);
  const [vehiculo, setVehiculo] = useState('Rojo');
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games/active');
        setPartidas(response.data);
      } catch (error) {
        console.error('Error al obtener partidas activas:', error);
      }
    };
    fetchPartidas();
    const interval = setInterval(fetchPartidas, 3000);
    return () => clearInterval(interval);
  }, []);

  const unirse = async () => {
    if (!seleccionada) return;
    try {
      await axios.post(`http://localhost:5000/api/players/join`, {
        gameId: seleccionada.id,
        nickname,
        vehiculo
      });
      navigate('/juego', { state: { gameId: seleccionada.id } });
    } catch (error) {
      console.error('Error al unirse a la partida:', error);
    }
  };

  return (
    <div className="join-bg">
      <div className="join-panel">
        <h1 className="join-title">¡Hola {nickname}!</h1>
        <p className="join-subtitle">Selecciona una partida y elige tu vehículo</p>

        <div className="vehicle-selector">
          <label htmlFor="vehiculo">Vehículo:</label>
          <select id="vehiculo" value={vehiculo} onChange={e => setVehiculo(e.target.value)}>
            <option value="Rojo">🚗 Rojo</option>
            <option value="Azul">🚙 Azul</option>
            <option value="Verde">🛺 Verde</option>
            <option value="Amarillo">🏎️ Amarillo</option>
          </select>
        </div>

        <div className="partidas-list">
          {partidas.length === 0 ? (
            <p className="join-message">No hay partidas disponibles</p>
          ) : (
            partidas.map((p) => (
              <div
                key={p.id}
                className={`partida-card ${seleccionada?.id === p.id ? 'seleccionada' : ''}`}
                onClick={() => setSeleccionada(p)}
              >
                <h3>🆔 Código: {p.id}</h3>
                <p>📍 Pista: {p.track}</p>
                <p>🎨 Tema: {p.theme}</p>
                <p>👥 Jugadores: {p.joined} / {p.max_players}</p>
              </div>
            ))
          )}
        </div>

        <button
          className="join-btn"
          disabled={!seleccionada}
          onClick={unirse}
        >
          Entrar a la partida 🚀
        </button>
      </div>
    </div>
  );
}