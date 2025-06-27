import React from "react";
import GameConfig from "./pages/GameConfig";
import MainMenu from "./pages/MainMenu";
import JoinGame from "./pages/JoinGame";
import GameLobby from "./pages/GameLobby";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Ranking from "./pages/Ranking";


/**
 * @file App.js
 * Componente principal de la aplicación que configura el enrutamiento del lado del cliente para el juego.
 * 
 * Rutas:
 * - "/"           : Renderiza el componente MainMenu.
 * - "/game-config": Renderiza el componente GameConfig.
 * - "/join-game"  : Renderiza el componente JoinGame.
 * - "/game-lobby" : Renderiza el componente GameLobby.
 * - "/waiting"    : Renderiza el componente WaitingRoom.
 * - "/auth"       : Renderiza el componente Auth.
 *
 * @component
 * @returns {JSX.Element} El enrutador con todas las rutas definidas para la aplicación.
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game-config" element={<GameConfig />} />
        <Route path="/join-game" element={<JoinGame />} />
        <Route path="/game-lobby" element={<GameLobby />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
