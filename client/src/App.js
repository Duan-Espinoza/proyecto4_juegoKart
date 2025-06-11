import React from "react";
import Autenticacion from "./pages/Auth";
import GameConfig from "./pages/GameConfig";
import MainMenu from "./pages/MainMenu";
import JoinGame from "./pages/JoinGame";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game-config" element={<GameConfig />} />
        <Route path="/join-game" element={<JoinGame />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
