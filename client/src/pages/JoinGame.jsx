import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinGame.css';
import { fetchGameSessions } from '../services/gameService';
import { getTrackById } from '../services/trackService';

export default function JoinGame() {
  const navigate = useNavigate();
  const nickname = localStorage.getItem('nickname') || 'Invitado';
  const [partidas, setPartidas] = useState([]);
  const [vehiculo, setVehiculo] = useState('Rojo');
  const [seleccionada, setSeleccionada] = useState(null);
  const [tracksInfo, setTracksInfo] = useState({});

  useEffect(() => {
    async function fetchAndSetPartidas() {
      try {
        const gameSessions = await fetchGameSessions();
        setPartidas(gameSessions);

        const uniqueTrackIds = [...new Set(gameSessions.map(p => p.idTrack))];
        const trackEntries = await Promise.all(
          uniqueTrackIds.map(async (id) => {
            const track = await getTrackById(id);
            return [id, track];
          })
        );
        const tracksMap = Object.fromEntries(trackEntries);
        setTracksInfo(tracksMap);
      } catch (error) {
        console.error('Error al obtener partidas y pistas:', error);
      }
    }

    fetchAndSetPartidas();

    const interval = setInterval(fetchAndSetPartidas, 3000);
    return () => clearInterval(interval);
  }, []);

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

        <div className="partidas-table-container">
          {partidas.length === 0 ? (
            <p className="join-message">No hay partidas disponibles</p>
          ) : (
            <table className="partidas-table">
              <thead>
                <tr>
                  <th>Modo</th>
                  <th>Pista</th>
                  <th>Jugadores</th>
                  <th>Vehículo</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {partidas.map(partida => {
                  const track = tracksInfo[partida.idTrack];
                  const isSelected = seleccionada === partida.id;
                  return (
                    <tr
                      key={partida.id}
                      className={isSelected ? 'selected-row' : ''}
                      onClick={() => setSeleccionada(partida.id)}
                    >
                      <td>{partida.gameMode}</td>
                      <td>{track ? track.nombre : 'Cargando...'}</td>
                      <td>{partida.players.length} / {track ? track.cantidadCarriles : '...'}</td>
                      <td>{vehiculo}</td>
                      <td>{partida.gameState}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <button
          className="join-btn"
          disabled={!seleccionada}
        >
          Entrar a la partida 🚀
        </button>
      </div>
    </div>
  );
}
