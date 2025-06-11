import React, { useState } from "react";
import "../styles/GameConfig.css"; 
import  {Button}  from "../components/Button";
import {ComboBox} from "../components/ComboBox";
import { useLocation, useNavigate } from "react-router-dom";

export default function GameConfig() {
  const [gameType, setGameType] = useState("");
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [track, setTrack] = useState("");
  const [laps, setLaps] = useState("");
  const [players, setPlayers] = useState("");
  const { nickname } = useLocation().state || {}; // Obtener el nickname del estado de la ubicación
  const navigate = useNavigate();

  const closeModal = () => setShowTrackModal(false);

  const saveTrackDetails = () => {
    if (!track || !laps || !players) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setShowTrackModal(false);
  };

  const handleStartGame = () => {
    if (!gameType || !track || !laps || !players) {
      alert("Por favor, completa todos los campos antes de iniciar la partida");
    } else {
      alert("¡Partida iniciada con éxito!");
    }
  };

  return (
    <div className="config-bg">
      <div className="config-panel">
        <Button className="config-btn-getBack" onClick={() => navigate("/")}>
          ←
        </Button>
        <h1 className="config-title">Configuración de Partida</h1>
        <p className="config-subtitle">Jugador: {nickname}</p>

        <div className="config-field">
          <ComboBox value={gameType} onChange={setGameType} />
        </div>

        <Button className="config-btn" onClick={() => setShowTrackModal(true)}>
          Seleccionar pista
        </Button>
      

        {track && (
          <div className="track-summary">
            <p><strong>Pista:</strong> {track}</p>
            <p><strong>Vueltas:</strong> {laps}</p>
            <p><strong>Jugadores:</strong> {players}</p>
          </div>
        )}

        <Button className="config-btn" onClick={handleStartGame}>
          Iniciar partida
        </Button>
      </div>

      {showTrackModal && (
        <div className="config-modal-overlay" onClick={closeModal}>
          <div className="config-modal" onClick={e => e.stopPropagation()}>
            <h2 className="config-title">Detalles de pista</h2>

            <div className="config-field">
              <label>Pista:</label>
              <select value={track} onChange={e => setTrack(e.target.value)}>
                <option value="">--Selecciona--</option>
                <option value="Pista 1">Pista 1</option>
                <option value="Pista 2">Pista 2</option>
                <option value="Pista 3">Pista 3</option>
              </select>
            </div>

            <div className="config-field">
              <label>Vueltas:</label>
              <input
                type="number"
                min="1"
                value={laps}
                onChange={e => setLaps(e.target.value)}
                placeholder="Ej: 3"
              />
            </div>

            <div className="config-field">
              <label>Jugadores:</label>
              <input
                type="number"
                min="1"
                value={players}
                onChange={e => setPlayers(e.target.value)}
                placeholder="Ej: 2"
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <Button className="config-btn" onClick={closeModal}>
                Cancelar
              </Button>
              <Button className="config-btn" onClick={saveTrackDetails}>
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}