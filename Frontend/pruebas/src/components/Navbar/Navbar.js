import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService, getUsuario } from '../../services';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = getUsuario();
    if (usuarioData) {
      setUsuario(usuarioData);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de cerrar sesión?')) {
      authService.logout();
    }
  };

// SCRUM-83: Links de navegación
  const menuItems = [
    { path: '/main', label: 'Dashboard', icon: '📊' },
    { path: '/Rutas', label: 'Rutas', icon: '🗺️' },
    { path: '/Bodegas', label: 'Vehículos', icon: '🚚' },
    { path: '/Cargas', label: 'Cargas', icon: '📦' },
    { path: '/Trabajadores', label: 'Trabajadores', icon: '👥' },
    { path: '/Reportes', label: 'Reportes', icon: '📋' }, // SCRUM-139
    { path: '/Cuenta', label: 'Mi Cuenta', icon: '⚙️' },
  ];

  return (
    <nav style={{
      backgroundColor: '#667eea',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}>
      {/* Top bar - Logo y Usuario */}
      <div style={{
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <h2 
          style={{ 
            color: 'white', 
            margin: 0, 
            cursor: 'pointer',
            fontSize: '22px',
          }}
          onClick={() => navigate('/main')}
        >
          ERP LuxChile
        </h2>
        
        {/* Usuario y Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {usuario && (
            <div style={{
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 15px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
            }}>
              <span style={{ fontSize: '18px' }}></span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>
                  {usuario.nombre}
                </span>
                <span style={{ fontSize: '11px', opacity: 0.9 }}>
                  {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                </span>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* SCRUM-83: Menú de navegación */}
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        padding: '0 30px',
      }}>
        <div style={{
          display: 'flex',
          gap: '5px',
        }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: '12px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.3s',
                  borderBottom: isActive ? '3px solid white' : '3px solid transparent',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
