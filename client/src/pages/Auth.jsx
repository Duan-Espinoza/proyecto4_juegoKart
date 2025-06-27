// File: client/src/components/Auth.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Auth.css'; 


/**
 * Componente Auth para gestionar la autenticación del usuario mediante un nickname.
 *
 * Este componente muestra un formulario donde el usuario puede ingresar su nickname
 * para continuar con el flujo de creación o unión a una partida, según el estado de navegación.
 * Al enviar el formulario, el nickname se pasa a la siguiente ruta utilizando el estado de navegación
 * de React Router. Maneja errores de navegación y proporciona retroalimentación al usuario.
 *
 * @component
 *
 * @example
 * // Uso en una ruta
 * <Route path="/auth" element={<Auth />} />
 *
 * @returns {JSX.Element} Interfaz de formulario de autenticación renderizada.
 */
export default function Auth() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const from = location.state?.from;

    try {
      if (from==='create') {
        navigate('/game-config', {
          state: { nickname }, // Pasar el nickname al siguiente componente
        });

      } else {
        navigate('/join-game', {
          state: { nickname }, // Pasar el nickname al siguiente componente
        });
      }

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
