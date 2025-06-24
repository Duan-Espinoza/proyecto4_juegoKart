import { useNavigate } from 'react-router-dom';
import '../styles/MainMenu.css'; 

export default function MainMenu() {
  const navigate = useNavigate();
  console.log("URL del backend:", process.env.REACT_APP_API_URL);


  return (
    <div className="menu-bg">
      <div className="menu-panel">
        <div className="menu-logo">
          <span role="img" aria-label="kart" className="logo-emoji">🏎️</span>
        </div>
        <h1 className="menu-title">Luiki Kart</h1>
        <p className="menu-subtitle">¡Elige una opción para comenzar!</p>
        <div className="menu-buttons">
          <button className="menu-btn blue" onClick={() => navigate('/auth', { state: { from: 'create' } })}>
            🎮 Crear Partida
          </button>
          <button className="menu-btn green" onClick={() => navigate('/auth', { state: { from: 'join' } })}>
            🚗 Unirse a Partida
          </button>
          <button className="menu-btn yellow" onClick={() => navigate('/ranking')}>
            🏁 Ver Ranking
          </button>
          <button className="menu-btn red" onClick={() => window.close()}>
            ❌ Salir
          </button>
        </div>
      </div>
    </div>
  );
}