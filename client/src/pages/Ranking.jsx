import { useEffect, useState } from "react";
import "../styles/Ranking.css";
 
/**
 * Componente Ranking
 *
 * Muestra una tabla con el ranking de partidas finalizadas, incluyendo información
 * sobre el ganador, tiempo, pista, vueltas e ID de la partida. Los tres primeros lugares
 * se destacan con emojis de podio. Si no hay partidas finalizadas, muestra un mensaje indicativo.
 *
 * @component
 *
 * @returns {JSX.Element} Panel con el ranking de partidas.
 */
export default function Ranking() {
  const [ranking, setRanking] = useState([]);
 
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/ranking")
      .then(res => res.json())
      .then(data => setRanking(data))
      .catch(err => console.error("Error al obtener ranking:", err));
  }, []);
 
  const getPodiumEmoji = (idx) => {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    if (idx === 2) return "🥉";
    return "";
  };
 
  return (
    <div className="ranking-bg">
      <div className="ranking-panel">
        <h1 className="ranking-title">🏁 Ranking de Partidas</h1>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ganador</th>
              <th>Tiempo</th>
              <th>Pista</th>
              <th>Vueltas</th>
              <th>ID Partida</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: "#888", fontStyle: "italic" }}>No hay partidas finalizadas aún.</td>
              </tr>
            )}
            {ranking.map((r, idx) => (
              <tr key={r.id}>
                <td>{getPodiumEmoji(idx)} {idx + 1}</td>
                <td style={{ fontWeight: idx === 0 ? "bold" : "normal", color: idx === 0 ? "#22c55e" : "#222" }}>
                  {r.winnerName}
                </td>
                <td>{r.timePlaying ?? "-"}</td>
                <td>{r.track}</td>
                <td>{r.laps}</td>
                <td>{r.idGame}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}