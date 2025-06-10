import React from "react";
import GameConfig from "./components/GameConfig";
import Autenticacion from "./components/Auth.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Autenticacion />} />
        <Route path="/game-config" element={<GameConfig />} />
      </Routes>
    </Router>
  );
}

export default App;
