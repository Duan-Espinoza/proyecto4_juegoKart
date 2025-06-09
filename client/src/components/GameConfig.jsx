import React, { useState } from "react";
import "../styles/GameConfig.css"; 
import ComboBox from "./ui/Combobox";

export default function GameConfig() {
  const [gameType, setGameType] = useState("");
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [track, setTrack] = useState("");
  const [laps, setLaps] = useState("");
  const [players, setPlayers] = useState("");

  const closeModal = () => setShowTrackModal(false);

  const saveTrackDetails = () => {
    if (!track || !laps || !players) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setShowTrackModal(false);
  };

  return (
    <div className="menu-bg">
      <div className="menu-panel">
        <h1 className="menu-title">Configuración de partida</h1>

        <ComboBox value={gameType} onChange={setGameType} />

        <button className="menu-btn" onClick={() => setShowTrackModal(true)}>
          Seleccionar pista
        </button>

        {track && (
          <div style={{ marginTop: 15, textAlign: "left" }}>
            <p><strong>Pista:</strong> {track}</p>
            <p><strong>Vueltas:</strong> {laps}</p>
            <p><strong>Jugadores:</strong> {players}</p>
          </div>
        )}

        <button
          className="menu-btn"
          onClick={() => {
            if (!gameType || !track || !laps || !players) {
              alert("Por favor, completa todos los campos antes de iniciar la partida");
            } else {
              alert("¡Partida iniciada con éxito!");
            }
          }}
        >
          Iniciar partida
        </button>
      </div>

      {showTrackModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: 10 }}>Detalles de pista</h2>

            <label>Pista:</label>
            <select value={track} onChange={e => setTrack(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>
              <option value="">--Selecciona--</option>
              <option value="Pista 1">Pista 1</option>
              <option value="Pista 2">Pista 2</option>
              <option value="Pista 3">Pista 3</option>
            </select>

            <label>Vueltas:</label>
            <input
              type="number"
              min="1"
              value={laps}
              onChange={e => setLaps(e.target.value)}
              placeholder="Ej: 3"
              style={{ width: "100%", marginBottom: 10 }}
            />

            <label>Jugadores:</label>
            <input
              type="number"
              min="1"
              value={players}
              onChange={e => setPlayers(e.target.value)}
              placeholder="Ej: 2"
              style={{ width: "100%", marginBottom: 20 }}
            />

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="menu-btn purple" onClick={closeModal} style={{ flex: 1, marginRight: 10 }}>
                Cancelar
              </button>
              <button className="menu-btn yellow" onClick={saveTrackDetails} style={{ flex: 1 }}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
