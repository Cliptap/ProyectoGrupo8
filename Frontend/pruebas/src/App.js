import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import Main from './components/main/main';
import Bodegas from './components/Bodegas/Bodegas';
import Cuentas from './components/Cuenta/Cuenta';
import Rutas from './components/Rutas/Rutas';
import Trabajadores from './components/Trabajadores/Trabajadores';
import Cargas from './components/Cargas/Cargas';
import GeneradorReportes from './components/Reportes/GeneradorReportes'; // SCRUM-139

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<Main />} />
        <Route path="/Bodegas" element={<Bodegas />} />
        <Route path="/Cuenta" element={<Cuentas />} />
        <Route path='/Rutas' element={<Rutas />} />
        <Route path='/Trabajadores' element={<Trabajadores />} />
        <Route path="/Cargas" element={<Cargas />} />
        <Route path="/Reportes" element={<GeneradorReportes />} /> {/* SCRUM-139 */}
      </Routes>
    </Router>
  );
}

export default App;