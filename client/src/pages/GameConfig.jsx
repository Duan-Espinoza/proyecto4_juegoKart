import React, { useState, useEffect } from "react";
import "../styles/GameConfig.css"; 
import { Button } from "../components/Button";
import { ComboBox } from "../components/ComboBox";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchTracks } from "../services/trackService";

export default function GameConfig() {
  const [gameType, setGameType] = useState("");
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [track, setTrack] = useState(null);  // Aquí guardamos objeto pista seleccionado
  const [laps, setLaps] = useState("");
  const [players, setPlayers] = useState("");
  const [trackOptions, setTrackOptions] = useState([]);  // Estado para pistas dinámicas

  const { nickname } = useLocation().state || {};
  const navigate = useNavigate();

  // Cargar pistas al montar el componente
  useEffect(() => {
    async function loadTracks() {
      try {
        const tracks = await fetchTracks();
        console.log("Pistas cargadas:", tracks);
        setTrackOptions(tracks);
      } catch (error) {
        console.error("Error cargando pistas:", error);
      }
    }
    loadTracks();
  }, []);

  const closeModal = () => setShowTrackModal(false);
  
  const saveTrackDetails = () => {
    if (!track || !laps || !players) {
      alert("Por favor, completa todos los campos");
      return;
    }

    // Verificar que la cantidad de los jugadores sea equivalente a la cantidad de carriles de la pista seleccionada
    if (track.cantidadCarriles !== parseInt(players, 10)) {
      alert(`La pista ${track.nombre} tiene ${track.cantidadCarriles} carriles. Por favor, selecciona ${track.cantidadCarriles} jugadores.`);
      return;
    }

    setShowTrackModal(false);
  };

  const handleStartGame = () => {
    if (!gameType || !track || !laps || !players) {
      alert("Por favor, completa todos los campos antes de iniciar la partida");
      return;
    }
    alert(`¡Partida iniciada con éxito en la pista ${track.nameTrack}!`);
    navigate("/game-lobby", {
      state: {
        nickname,
        gameType,
      },
    });
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
            <p><strong>Pista:</strong> {track.nombre}</p>
            <p><strong>Tema:</strong> {track.tema}</p>
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
              <select
                value={track ? track.nombre : ""}
                onChange={e => {
                  const selectedTrack = trackOptions.find(t => t.nombre === e.target.value);
                  setTrack(selectedTrack || null);
                }}
              >
                <option value="">--Selecciona--</option>
                {trackOptions.map(t => (
                  <option key={t.id} value={t.nombre}>
                    {t.nombre}
                  </option>
                ))}
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
                min="2"
                max="3"
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
