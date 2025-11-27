import { useState, useEffect } from 'react';
import Navbar from "../Navbar/Navbar";
import CargaCard from './CargaCard';
import FormularioCarga from './FormularioCarga';
import cargasService from '../../services/cargasService';

function Cargas() {
  const [cargas, setCargas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    cargarCargas();
  }, []);

  const cargarCargas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cargasService.obtenerTodos();
      setCargas(data);
    } catch (err) {
      setError(err.message || 'Error al cargar cargas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarNueva = async (datos) => {
    try {
      await cargasService.crear(datos);
      setMostrarFormulario(false);
      cargarCargas(); // Recargar lista
      alert('✅ Carga creada exitosamente con estado "pendiente"');
    } catch (error) {
      alert(`❌ Error: ${error}`);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          fontSize: '24px',
          color: '#667eea',
        }}>
          ⏳ Cargando cargas...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <div style={{ fontSize: '24px', color: '#e74c3c' }}>{error}</div>
          <button
            onClick={cargarCargas}
            style={{
              padding: '12px 24px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '8px',
            }}>
              📦 Gestión de Cargas
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#7f8c8d',
            }}>
              Total de cargas: <strong>{cargas.length}</strong>
            </p>
          </div>

          <button
            onClick={() => setMostrarFormulario(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#229954'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#27ae60'}
          >
            ➕ Nueva Carga
          </button>
        </div>

        {/* Grid de cargas */}
        {cargas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 24px',
            backgroundColor: '#f8f9fa',
            borderRadius: '16px',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '24px', color: '#7f8c8d', marginBottom: '8px' }}>
              No hay cargas registradas
            </div>
            <div style={{ fontSize: '16px', color: '#95a5a6' }}>
              Comienza agregando una nueva carga
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '24px',
          }}>
            {cargas.map((carga) => (
              <CargaCard
                key={carga.id}
                carga={carga}
              />
            ))}
          </div>
        )}
      </div>
      {/* Modal de formulario */}
      {mostrarFormulario && (
        <FormularioCarga
          onCerrar={() => setMostrarFormulario(false)}
          onGuardar={handleGuardarNueva}
        />
      )}
    </div>
  );
}

export default Cargas;
