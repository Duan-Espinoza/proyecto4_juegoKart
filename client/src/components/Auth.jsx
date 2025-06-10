// File: client/src/components/Auth.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Auth.css'; 
import { registerPlayer } from '../services/playerService';


export default function Autenticacion() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      await registerPlayer(nickname);
      navigate('/game-config', {
        state: { nickname }, 
      });
    } catch (error) {
      console.error('Error al registrar el jugador:', error);
      alert('Error al registrar el jugador. Por favor, inténtalo de nuevo.');
      return;
    }

  };
  return (
    <div className="auth-bg">
      <div className="auth-panel">
        <div className="auth-logo">
          <span role="img" aria-label="player" className="logo-emoji">👤</span>
        </div>
        <h1 className="auth-title">Bienvenido a Luiki Kart</h1>
        <p className="auth-subtitle">Ingresa tu nickname para continuar</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            className="auth-input"
            placeholder="Tu nickname..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button type="submit" className="auth-btn">
            Continuar 🚀
          </button>
        </form>
      </div>
    </div>
  );
}
