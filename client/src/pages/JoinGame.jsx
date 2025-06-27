import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/JoinGame.css';
import { fetchGameSessions } from '../services/gameService';
import { getTrackById } from '../services/trackService';
import { getHostPlayer } from '../services/playerService';
import { registerPlayer } from '../services/playerService';
import socket from '../services/socket';

/**
 * Componente JoinGame
 * 
 * Este componente permite a un usuario unirse a una partida existente en el juego de karts.
 * 
 * Funcionalidades principales:
 * - Muestra una lista de partidas disponibles, actualizándose en tiempo real mediante sockets.
 * - Permite seleccionar un vehículo antes de unirse a la partida.
 * - Muestra información relevante de cada partida: host, modo de juego, pista, número de jugadores y vueltas.
 * - Gestiona la lógica de unión a la partida, incluyendo el registro del jugador y la navegación al lobby del juego.
 * - Controla el tiempo de inicio de la partida y alerta si la sesión ha expirado.
 * 
 * Hooks utilizados:
 * - useState: para manejar el estado de partidas, vehículo seleccionado, partida seleccionada, información de pistas, hosts, tiempo de inicio y temporizador.
 * - useEffect: para gestionar la suscripción a eventos de sockets, la actualización periódica de partidas y el temporizador de la sesión.
 * 
 * Props:
 * - No recibe props directamente, pero utiliza el nickname recibido a través del estado de navegación.
 * 
 * Dependencias externas:
 * - socket: para comunicación en tiempo real con el servidor.
 * - fetchGameSessions, getTrackById, getHostPlayer, registerPlayer: funciones para interactuar con la API del backend.
 * - useNavigate, useLocation: hooks de react-router-dom para navegación y acceso al estado de la ruta.
 * 
 * @component
 */
export default function JoinGame() {
  const navigate = useNavigate();
  const { nickname } = useLocation().state || {};
  const [partidas, setPartidas] = useState([]);
  const [vehiculo, setVehiculo] = useState('Rojo');
  const [seleccionada, setSeleccionada] = useState(null);
  const [tracksInfo, setTracksInfo] = useState({});
  const [hostPlayers, setHostPlayers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    socket.on("sessionInfo", ({ startTime }) => {
    const numericStart = Number(startTime);
      console.log("Información de la sesión recibida:", startTime, new Date(numericStart).toLocaleTimeString());

    if (!isNaN(numericStart)) {
      setStartTime(numericStart);
    } else {
      console.warn("startTime inválido recibido:", startTime);
    }
  });

  return () => socket.off("sessionInfo");
}, []);


  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((startTime - Date.now()) / 1000));
      setTimer(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        alert("La partida ha expirado.");
        navigate("/");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);


  useEffect(() => {
    async function fetchAvailableGames() {
      try {
        const games = await fetchGameSessions();
        setPartidas(games);
        const uniqueTrackIds = [...new Set(games.map(p => p.idTrack))];
        const trackEntries = await Promise.all(
          uniqueTrackIds.map(async (id) => {
            const track = await getTrackById(id);
            return [id, track];
          })
        );

        const tracksMap = Object.fromEntries(trackEntries);
        setTracksInfo(tracksMap);

        const hostPromises = games.map(async (game) => {
          const host = await getHostPlayer(game.id);
          return { gameId: game.id, hostNickname: host.nickName };
        });

        const hostPlayersData = await Promise.all(hostPromises);
        setHostPlayers(hostPlayersData);

      } catch (error) {
        console.error('Error fetching available games:', error);
        alert('Error al cargar las partidas disponibles. Inténtalo de nuevo más tarde.');
      }
    }
    fetchAvailableGames();
  }, []);

  useEffect(() => {

    const handleAvailableGames = (games) => {
      setPartidas(games);

      const uniqueTrackIds = [...new Set(games.map(p => p.idTrack))];
      Promise.all(
        uniqueTrackIds.map(async (id) => {
          const track = await getTrackById(id);
          return [id, track];
        })
      ).then(trackEntries => {
        const tracksMap = Object.fromEntries(trackEntries);
        setTracksInfo(tracksMap);
      });
    }

    socket.on('availableGames', handleAvailableGames);

    socket.emit('requestAvailableGames');

    const interval = setInterval(() => {
      socket.emit('requestAvailableGames');
    }, 3000); // Actualiza cada 3 segundos

    return () => {
      socket.off('availableGames', handleAvailableGames);
      clearInterval(interval);
    };
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
                  <th>Host</th>
                  <th>Modo</th>
                  <th>Pista</th>
                  <th>Jugadores</th>
                  <th>Vueltas</th>  
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
                      <td>
                        {hostPlayers.find(h => h.gameId === partida.id)?.hostNickname || 'Cargando...'}
                      </td>
                      <td>{partida.gameMode}</td>
                      <td>{track ? track.nombre : 'Cargando...'}</td>
                      <td>{partida.players.length} / {track ? track.cantidadCarriles : '...'}</td>
                      <td>{partida.totalLaps}</td>
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
          onClick={() => {
          const partida = partidas.find(p => p.id === seleccionada);
          if (!partida) {
            alert("La partida ya no está disponible.");
          return;
          }

          const isHost = false;
          registerPlayer({ idSession: partida.id, nickname, isHost })
          .then(() => {
            // 🔊 Emitimos joinRoom
            socket.emit("joinRoom", {
            roomId: partida.id,
            nickname,
            vehicle: vehiculo
          });

      //🕒 Esperamos a recibir el startTime antes de navegar
      const handleSessionInfo = ({ startTime }) => {
        const numericStart = Number(startTime);
        if (isNaN(numericStart)) {
          alert("Error: startTime inválido recibido");
          return;
        }

        // ✅ Navegar solo después de recibir el tiempo
        navigate("/game-lobby", {
          state: {
            nickname,
            sessionId: partida.id,
            vehicle: vehiculo,
            isHost: false,
            startTime: numericStart
          }
        });

        socket.off("sessionInfo", handleSessionInfo); // Limpiar listener
      };

      socket.on("sessionInfo", handleSessionInfo);// Escuchar el evento sessionInfo
      socket.emit("validateJoin", {
        roomId: partida.id,
        nickname,
        vehicle: vehiculo
      });

    })
    .catch((error) => {
      console.error("Error al registrar jugador:", error);
      alert("Error al unirse a la partida.");
    });
}}
        >
          Entrar a la partida 🚀
        </button>
      </div>
    </div>
  );
}