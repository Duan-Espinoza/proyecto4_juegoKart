import React, { useState } from "react";
import { Button } from "./ui/Button";
import ComboBox from "./ui/Combobox";

export default function GameConfig() {
  const [gameType, setGameType] = useState("");
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [track, setTrack] = useState("");
  const [laps, setLaps] = useState("");
  const [players, setPlayers] = useState("");

  // Para cerrar la modal
  const closeModal = () => setShowTrackModal(false);

  // Para guardar datos y cerrar modal (podrías ampliar aquí la lógica)
  const saveTrackDetails = () => {
    if (!track || !laps || !players) {
      alert("Por favor, completa todos los campos");
      return;
    }
    setShowTrackModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <h1 className="text-2xl font-bold mb-4">Configuración de partida</h1>

      <div style={{ maxWidth: "400px", width: "100%", padding: "1rem", border: "1px solid #ccc", borderRadius: 8 }}>
        <ComboBox value={gameType} onChange={setGameType} />

        <Button style={{ marginTop: 20 }} onClick={() => setShowTrackModal(true)}>
          Seleccionar pista
        </Button>

        {track && (
          <div style={{ marginTop: 10 }}>
            <p><strong>Pista:</strong> {track}</p>
            <p><strong>Vueltas:</strong> {laps}</p>
            <p><strong>Jugadores:</strong> {players}</p>
          </div>
        )}
      </div>

      {showTrackModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
          onClick={closeModal} // cerrar si clicas fuera del modal
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              minWidth: 300,
              position: "relative"
            }}
            onClick={e => e.stopPropagation()} 
          >
            <h2>Selecciona detalles de la pista</h2>

            <div style={{ marginBottom: 10 }}>
              <label>Pista:</label>
              <select value={track} onChange={e => setTrack(e.target.value)} style={{ width: "100%", padding: 6 }}>
                <option value="">--Selecciona--</option>
                <option value="Pista 1">Pista 1</option>
                <option value="Pista 2">Pista 2</option>
                <option value="Pista 3">Pista 3</option>
              </select>
            </div>

            <div style={{ marginBottom: 10 }}>
              <label>Número de vueltas:</label>
              <input
                type="number"
                min="1"
                value={laps}
                onChange={e => setLaps(e.target.value)}
                style={{ width: "100%", padding: 6 }}
                placeholder="Ej: 3"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Cantidad de jugadores:</label>
              <input
                type="number"
                min="1"
                value={players}
                onChange={e => setPlayers(e.target.value)}
                style={{ width: "100%", padding: 6 }}
                placeholder="Ej: 2"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={closeModal} style={{ marginRight: 10 }}>
                Cancelar
              </Button>
              <Button onClick={saveTrackDetails}>Guardar</Button>
            </div>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => {
          if (!gameType || !track || !laps || !players) {
            alert("Por favor, completa todos los campos antes de iniciar la partida");
          } else {
            // Aquí podrías iniciar la partida
            alert("Partida iniciada con éxito!");
          }
        }}
        style={{ marginTop: 20 }}
      >
        Iniciar partida
      </Button>
    </div>
  );
}