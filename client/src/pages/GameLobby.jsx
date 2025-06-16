import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import "../styles/GameLobby.css";

// Configuración global
const GAME_TIMEOUT_SECONDS = 180; // tiempo límite configurable (3 minutos)

export default function GameLobby() {
  const navigate = useNavigate();
  const { nickname } = useLocation().state || {};
  
  const [players, setPlayers] = useState([nickname]);
  const [isHost, setIsHost] = useState(true);
  const [gameReady, setGameReady] = useState(false);
  const [timer, setTimer] = useState(GAME_TIMEOUT_SECONDS);
  const [gameCode] = useState(() => generateGameCode());

  useEffect(() => {
    // Simular llegada de jugadores
    const joinTimer = setTimeout(() => {
      setPlayers(prev => [...prev, "Jugador2", "Jugador3"]);
      setGameReady(true);
    }, 3000);

    // Cronómetro de cuenta regresiva
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          alert("La partida ha expirado. Regresando al inicio.");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(joinTimer);
      clearInterval(countdown);
    };
  }, [navigate]);

  const handleStartGame = () => {
    if (gameReady) {
      navigate("/game", { state: { players } });
    }
  };

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

      <Button className="lobby-exit-btn" onClick={() => navigate("/")}>
        Salir del Lobby
      </Button>
    </div>
  );
}

// Función para generar un código aleatorio de 6 caracteres
function generateGameCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
