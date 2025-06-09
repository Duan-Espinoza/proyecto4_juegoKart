import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPrincipal from './components/MenuPrincipal';
import CrearPartida from './components/CrearPartida';
import UnirsePartida from './components/UnirsePartida';
import './App.css';
import axios from 'axios';

const apiCall = () => {
  axios.get('/').then((data) => {
    console.log(data);
  });
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuPrincipal />} />
        <Route path="/crear" element={<CrearPartida />} />
        <Route path="/unirse" element={<UnirsePartida />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </Router>
  );
}

export default App;
