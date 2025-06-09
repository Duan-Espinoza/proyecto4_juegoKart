import { useNavigate } from 'react-router-dom';
import './MenuPrincipal.css';

export default function MenuPrincipal() {
  const navigate = useNavigate();

  return (
    <div className="menu-bg">
      <div className="menu-panel">
        <div className="menu-logo">
          <span role="img" aria-label="kart" className="logo-emoji">🏎️</span>
        </div>
        <h1 className="menu-title">Luiki Kart</h1>
        <p className="menu-subtitle">¡Elige una opción para comenzar!</p>
        <div className="menu-buttons">
          <button className="menu-btn purple" onClick={() => navigate('/crear')}>
            🎮 Crear Partida
          </button>
          <button className="menu-btn pink" onClick={() => navigate('/unirse')}>
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