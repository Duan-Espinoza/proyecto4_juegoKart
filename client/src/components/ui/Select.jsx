// src/components/ui/Select.jsx
import React from "react";

export function Select({ className = "", children, ...props }) {
  return (
    <select
      {...props}
    >
      {children}
    </select>
  );
}

// Opcionalmente puedes crear componentes para los items si quieres, pero en HTML basta con usar <option>
export function SelectTrigger(props) {
  // En este ejemplo simple, SelectTrigger no hace nada especial
  return <div {...props} />;
}

export function SelectValue(props) {
  // Similar, puede ser un span o div que muestre el valor seleccionado
  return <span {...props} />;
}

export function SelectContent(props) {
  // Podría usarse para un dropdown, aquí solo un div contenedor
  return <div {...props} />;
}

export function SelectItem({ value, children, ...props }) {
  return (
    <option value={value} {...props}>
      {children}
    </option>
  );
}
