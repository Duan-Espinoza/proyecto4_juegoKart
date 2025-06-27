import React, { use, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import "../styles/GameLobby.css";
import { createGameSession } from "../services/gameService";
import { registerPlayer } from "../services/playerService";
import { getIDTrackByName } from "../services/trackService";
import socket from "../services/socket";

/**
 * Componente GameLobby
 * 
 * Este componente representa la sala de espera ("lobby") de una partida multijugador de un juego de karts.
 * Permite a los jugadores unirse a la sala, muestra la lista de jugadores conectados, 
 * gestiona la cuenta regresiva hasta el inicio de la partida y permite al anfitrión iniciar o cancelar la partida.
 * 
 * Funcionalidades principales:
 * - Creación y gestión de la sesión de juego.
 * - Escucha de eventos de nuevos jugadores, inicio y cierre de la partida mediante sockets.
 * - Muestra el temporizador de inicio y la lista de jugadores conectados.
 * - Permite al anfitrión iniciar la partida automáticamente cuando se completa el número de jugadores.
 * - Permite cancelar la partida y regresar al menú principal.
 * 
 * Props: No recibe props directamente, utiliza el estado de navegación (useLocation) para obtener los datos iniciales.
 * 
 * Estado:
 * - players: Lista de jugadores conectados.
 * - isHost: Indica si el usuario actual es el anfitrión.
 * - gameReady: Indica si la partida está lista para iniciar.
 * - idTrack: ID de la pista seleccionada.
 * - sessionId: ID de la sesión de juego.
 * - startTime: Tiempo de inicio de la partida.
 * - timer: Tiempo restante para el inicio de la partida.
 * - vehicleType: Tipo de vehículo seleccionado por el jugador.
 * 
 * Hooks utilizados:
 * - useEffect: Para gestionar la suscripción a eventos de sockets y el ciclo de vida del componente.
 * - useState: Para manejar el estado interno del lobby.
 * - useNavigate, useLocation: Para navegación y obtención de datos de la ruta.
 * 
 * Eventos de socket escuchados:
 * - "sessionInfo": Recibe información de la sesión, incluyendo el tiempo de inicio.
 * - "sessionClosed": Notifica el cierre de la sala.
 * - "playerJoined": Notifica la llegada de un nuevo jugador.
 * - "gameStarted": Indica el inicio de la partida.
 * 
 * Eventos de socket emitidos:
 * - "joinRoom": Unirse a la sala.
 * - "createRoom": Crear una nueva sala.
 * - "closeRoom": Cerrar la sala (solo anfitrión).
 * - "startGame": Iniciar la partida (solo anfitrión).
 * 
 * @component
 */
export default function GameLobby() {
  const navigate = useNavigate();
  const { nickname, gameType, track, laps, numPlayers, startTime: initialStartTime, isHostPlayer, vehicle } = useLocation().state || {};
  const [players, setPlayers] = useState([nickname]);
  const [isHost, setIsHost] = useState(isHostPlayer || false);
  const [gameReady, setGameReady] = useState(false);
  const [idTrack, setIdTrack] = useState(null);
  const [sessionId, setSessionId] = useState(null); // para unirse a la sala
  const [startTime, setStartTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [vehicleType, setVehicleType] = useState(vehicle || "Rojo");
  
  useEffect(() => {
    if (initialStartTime) {
      setStartTime(initialStartTime);
    }
  }, [initialStartTime]);

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



  //  Cuenta regresiva
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
  socket.on("sessionClosed", ({ roomId }) => {
    alert("La partida ha sido cerrada.");
    navigate("/");
  });
    return () => socket.off("sessionClosed");
  }, [navigate]);

  // Botón para cerrar manualmente
  const handleLeaveAsHost = () => {
    socket.emit("closeRoom", { roomId: sessionId });
  };

  //  Crear sesión y unirse a la sala socket
  useEffect(() => {
    async function createSession() {
      try {
        const idTrack = await getIDTrackByName(track.nombre);
        setIdTrack(idTrack);
      

        console.log("Creando sesión de juego con los siguientes datos:", {
          players: [nickname],
          gameType,
          idTrack,
          track,
          laps,
          numPlayers
        });
        
        const data = await createGameSession({
          players: [nickname],
          gameType,
          idTrack,
          track,
          laps,
          numPlayers
        });
        console.log("Sesión creada:", data);

        setSessionId(data.sessionId);

        await registerPlayer({
          idSession: data.sessionId,
          nickname: nickname,
          isHost: true
        });


        socket.emit("joinRoom", {
          roomId: data.sessionId,
          nickname: nickname,
          vehicle: "Rojo"
        });

        socket.emit("createRoom", { roomId: data.sessionId });

      } catch (error) {
        console.error("Error creando partida:", error);
      }
    }

    createSession();
  }, [nickname, gameType, track, laps, numPlayers]);

  // 🎧 Escuchar si nuevos jugadores se conectan
  useEffect(() => {
    const handleNewPlayer = (data) => {
      setPlayers((prev) => {
        if (!prev.includes(data.nickname)) {
          return [...prev, data.nickname];
        }
        return prev;
      });
    };

    socket.on("playerJoined", handleNewPlayer);

    return () => {
      socket.off("playerJoined", handleNewPlayer);
    };
  }, []);

  useEffect(() => {
  if (players.length === numPlayers) {
    setGameReady(true);

    // 🚀 Iniciar automáticamente si soy host
    if (isHost && sessionId) {
      console.log("🎮 Jugadores completos. Iniciando partida automáticamente...");
      socket.emit("startGame", { roomId: sessionId });
    }
  }
}, [players, numPlayers, isHost, sessionId]);


  // ▶️ Emitir evento de inicio a todos
  const handleStartGame = () => {
    if (gameReady && sessionId) {
      socket.emit("startGame", { roomId: sessionId });
    }
  };

  // 🚀 Ir a la partida cuando se reciba evento
  useEffect(() => {
    socket.on("gameStarted", () => {
      navigate("/game", { state: { players, sessionId, nickname } });
    });

    return () => {
      socket.off("gameStarted");
    };
  }, [navigate, players, sessionId, nickname]);

  

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="lobby-container">
      <h1 className="lobby-title">Lobby de Partida</h1>
      <p className="lobby-timer">Tiempo restante: {formatTime(timer)}</p>

      <ul className="lobby-player-list">
        {players.map((player, index) => (
          <li key={index} className="lobby-player">{player}</li>
        ))}
      </ul>

      {isHost && (
        <Button
          className="lobby-start-btn"
          onClick={handleStartGame}
          disabled={!gameReady}
        >
          {gameReady ? "Iniciar Partida" : "Esperando jugadores..."}
        </Button>
      )}

      <Button className="lobby-exit-btn" onClick={handleLeaveAsHost}>
        Cancelar Partida
      </Button>
      

    </div>
  );
}


