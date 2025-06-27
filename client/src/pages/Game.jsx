import { useEffect, useState, useRef } from "react";
import socket from "../services/socket";
import "../styles/Game.css";
import { useLocation } from "react-router-dom";

export default function Game() {
  const [board, setBoard] = useState([]); // Matriz de la pista
  const [players, setPlayers] = useState([]); // [{nickname, x, y, direction, vehicle, laps}]
  const [myPlayer, setMyPlayer] = useState(null);
  const [winner, setWinner] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [canMove, setCanMove] = useState(false);
  const location = useLocation();
  const [gameStats, setGameStats] = useState(null);

  useEffect(() => {
    socket.on("gameOver", (data) => {
      setWinner(data.winner);
      setGameStats(data);
      setCanMove(false);
    });
    return () => socket.off("gameOver");
  }, []);


  // Recibe la pista y posiciones iniciales
  useEffect(() => {
    socket.on("initBoard", ({ board, players }) => {
      setBoard(board);
      setPlayers(players);
      // Opcional: identifica tu propio jugador
      const myNick = location.state?.nickname;
      if (myNick) {
        const me = players.find(p => p.nickname === myNick);
        setMyPlayer(me);
      }
    });
    return () => socket.off("initBoard");
  }, [location.state]);

  // Escuchar cuenta regresiva y habilitar movimiento
  useEffect(() => {
    socket.on("countdown", ({ value }) => {
      setCountdown(value);
      if (value === "GO") {
        setTimeout(() => setCountdown(null), 1000);
      }
    });
    socket.on("canMove", ({ canMove }) => setCanMove(canMove));
    return () => {
      socket.off("countdown");
      socket.off("canMove");
    };
  }, []);

  // Host: presionar "u" para iniciar cuenta regresiva
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "u" || e.key === "U") {
        // Solo el host debe emitir esto (agrega tu lógica de host aquí)
        socket.emit("startCountdown", { gameId: myPlayer?.gameId });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [myPlayer]);

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

  // Manejar teclas de movimiento
  // Solo permitir movimiento si canMove es true y no hay ganador
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!canMove || winner) return;
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
        {gameStats && (
          <div className="game-stats">
            <h3>Estadísticas de la partida</h3>
            <p><strong>Pista:</strong> {typeof gameStats.track === "string" ? gameStats.track : "Pista"}</p>
            <p><strong>ID de partida:</strong> {gameStats.gameId}</p>
            <p><strong>Vueltas:</strong> {gameStats.totalLaps}</p>
            <table>
              <thead>
                <tr>
                  <th>Jugador</th>
                  <th>Vehículo</th>
                  <th>Vueltas</th>
                </tr>
              </thead>
              <tbody>
                {gameStats.stats.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.nickname}</td>
                    <td>{p.vehicle}</td>
                    <td>{p.lapsCompleted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="game-board">
          {board.map((row, y) =>
            row.map((cell, x) => {
              // ¿Hay un jugador en esta celda?
              const playerHere = players.find(p => p.x === x && p.y === y);
              return (
                <div
                  key={`${x}-${y}`}
                  className={`cell ${cell === "X" ? "wall" : cell === "L" ? "meta" : ""} ${playerHere ? "vehicle" : ""}`}
                >
                  {playerHere ? (
                    <span className="vehicle-icon">
                      {playerHere.vehicle === "Rojo" && "🚗"}
                      {playerHere.vehicle === "Azul" && "🚙"}
                      {playerHere.vehicle === "Verde" && "🛺"}
                      {playerHere.vehicle === "Amarillo" && "🏎️"}
                    </span>
                  ) : cell === "L" ? "🏁" : ""}
                </div>
              );
            })
          )}
        </div>
        <div className="game-players">
          {players.map(p => (
            <div key={p.nickname} className="player-info">
              <span className="vehicle-icon">
                {p.vehicle === "Rojo" && "🚗"}
                {p.vehicle === "Azul" && "🚙"}
                {p.vehicle === "Verde" && "🛺"}
                {p.vehicle === "Amarillo" && "🏎️"}
              </span>
              <span>{p.nickname}</span>
              <span>Vueltas: {p.lapsCompleted}</span>
              {/* Indicar si va en sentido contrario */}
              {p.isReverse && <span style={{ color: "red", marginLeft: 8 }}>⛔ Sentido contrario</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}