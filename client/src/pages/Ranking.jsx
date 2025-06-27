import { useEffect, useState } from "react";

export default function Ranking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/ranking")
      .then(res => res.json())
      .then(data => setRanking(data))
      .catch(err => console.error("Error al obtener ranking:", err));
  }, []);

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
            {ranking.map((r, idx) => (
              <tr key={r.id}>
                <td>{idx + 1}</td>
                <td>{r.winnerName}</td>
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