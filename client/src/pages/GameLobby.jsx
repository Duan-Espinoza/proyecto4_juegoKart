import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import "../styles/GameLobby.css";
import { createGameSession } from "../services/gameService";
import { registerPlayer } from "../services/playerService";
import { getIDTrackByName } from "../services/trackService";
import socket from "../services/socket";

const GAME_TIMEOUT_SECONDS = 180;

export default function GameLobby() {
  const navigate = useNavigate();
  const { nickname, gameType, track, laps, numPlayers } = useLocation().state || {};
  const [players, setPlayers] = useState([nickname]);
  const [isHost, setIsHost] = useState(true);
  const [gameReady, setGameReady] = useState(false);
  const [timer, setTimer] = useState(GAME_TIMEOUT_SECONDS);
  const [gameCode] = useState(() => generateGameCode());
  const [idTrack, setIdTrack] = useState(null);
  const [sessionId, setSessionId] = useState(null); // para unirse a la sala

  //  Cuenta regresiva
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          alert("La partida ha expirado. Regresando al inicio.");
          socket.emit("closeRoom", { roomId: sessionId }); 
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [navigate]);



  useEffect(() => {
  socket.on("sessionClosed", ({ roomId }) => {
    alert("La partida ha sido cerrada.");
    navigate("/");
  });
    return () => socket.off("sessionClosed");
  }, [navigate]);

  // Botón para cerrar manualmente
  const handleLeaveAsHost = () => {
    socket.emit("closeRoom", { roomId: sessionId }); // 🔴 Notifica al backend
  };


  //  Crear sesión y unirse a la sala socket
  useEffect(() => {
    async function createSession() {
      try {
        const idTrack = await getIDTrackByName(track.nombre);
        setIdTrack(idTrack);

        const data = await createGameSession({
          players: [nickname],
          gameType,
          idTrack,
          track,
          laps,
          numPlayers
        });

        setSessionId(data.sessionId);

        await registerPlayer({
          idSession: data.sessionId,
          nickname,
          isHost: true
        });

        // 💬 Unirse a la sala WebSocket
        socket.emit("joinRoom", {
          roomId: data.sessionId,
          nickname,
          vehicle: "Rojo" // Si deseas incluirlo aquí
        });

        setIsHost(true);
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
    }
  }, [players, numPlayers]);

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
      <p className="lobby-subtitle">Código de partida: <strong>{gameCode}</strong></p>
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

function generateGameCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
