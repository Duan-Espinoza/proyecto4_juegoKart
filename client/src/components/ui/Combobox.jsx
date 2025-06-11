import React, { useState } from "react";

export default function ComboBox({ onChange, value }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label htmlFor="gameType" style={{ display: "block", marginBottom: "0.5rem" }}>
        Tipo de partida
      </label>
      <select
        id="gameType"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      >
        <option value="">Selecciona tipo de partida</option>
        <option value="vs">VS</option>
        <option value="tiempo">Tiempo</option>
      </select>
    </div>
  );
}