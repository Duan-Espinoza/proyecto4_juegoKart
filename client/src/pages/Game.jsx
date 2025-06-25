import { useEffect, useState, useRef } from "react";
import socket from "../services/socket";
import "../styles/Game.css";

export default function Game() {
  const [board, setBoard] = useState([]); // Matriz de la pista
  const [players, setPlayers] = useState([]); // [{nickname, x, y, direction, vehicle, laps}]
  const [myPlayer, setMyPlayer] = useState(null);
  const [winner, setWinner] = useState(null);

  // Cargar pista y jugadores al montar
  useEffect(() => {
    // fetch pista y jugadores iniciales
  }, []);

  // Escuchar actualizaciones de posiciones
  useEffect(() => {
    socket.on("updatePosition", ({ players }) => {
      setPlayers(players);
      // Detectar ganador
      const winner = players.find(p => p.lapsCompleted >= TOTAL_LAPS);
      if (winner) setWinner(winner.nickname);
    });
    return () => socket.off("updatePosition");
  }, []);

  // Manejar teclas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (winner) return;
      let direction = null;
      if (e.key === "ArrowUp") direction = "up";
      if (e.key === "ArrowDown") direction = "down";
      if (e.key === "ArrowLeft") direction = "left";
      if (e.key === "ArrowRight") direction = "right";
      if (direction) {
        socket.emit("playerMove", { gameId: myPlayer?.gameId, nickname: myPlayer.nickname, direction });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [myPlayer, winner]);

  return (
    <div className="game-bg">
      <div className="game-panel">
        <h2 className="game-title">¡A correr!</h2>
        {winner && <div className="game-winner">🏆 Ganador: {winner}</div>}
        <div className="game-board">
          {/* Renderizar la matriz de la pista y los vehículos */}
        </div>
        <div className="game-players">
          {players.map(p => (
            <div key={p.nickname} className="player-info">
              <span className="vehicle-icon">{/* icono según vehículo */}</span>
              <span>{p.nickname}</span>
              <span>Vueltas: {p.lapsCompleted}</span>
              {/* Indicar si va en sentido contrario */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}