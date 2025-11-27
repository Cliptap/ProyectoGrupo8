import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import FormularioRuta from './FormularioRuta';
import SelectorEstadoRuta from './SelectorEstadoRuta';
import { isAuthenticated, rutasService } from '../../services';

function Rutas() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  // Estados para rutas del backend
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

  // Estados para Google Maps
  const [map, setMap] = useState(null);
  const [ubicacionActual, setUbicacionActual] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  // SCRUM-93: Estado para el modal
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated()) {
      navigate('/', { replace: true });
      return;
    }

    cargarRutas();
  }, [navigate]);

  // Inicializar mapa DESPUÉS de que termine el loading
  useEffect(() => {
    if (!loading && mapRef.current && !map) {
      console.log('🎯 Loading terminó, inicializando mapa...');
      inicializarMapa();
    }
  }, [loading]);

  // SCRUM-91: Cargar rutas desde el backend
  const cargarRutas = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await rutasService.obtenerTodos();
      console.log('✅ Rutas obtenidas:', data);

      setRutas(data);
    } catch (err) {
      console.error('❌ Error al cargar rutas:', err);
      setError(err || 'Error al cargar rutas');
    } finally {
      setLoading(false);
    }
  };

  // SCRUM-95: Inicializar Google Maps con debug
  const inicializarMapa = () => {
    console.log('🗺️ Intentando inicializar mapa...', {
      googleExists: !!window.google,
      mapExists: !!map,
      refExists: !!mapRef.current
    });

    if (!window.google) {
      console.log('⏳ Google Maps aún no está cargado, reintentando en 100ms...');
      setTimeout(inicializarMapa, 100);
      return;
    }

    if (map) {
      console.log('✅ Mapa ya inicializado');
      return;
    }

    if (!mapRef.current) {
      console.log('❌ mapRef no existe aún');
      return;
    }

    console.log('📍 Obteniendo ubicación...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const actual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log('📍 Ubicación obtenida:', actual);
        setUbicacionActual(actual);

        const newMap = new window.google.maps.Map(mapRef.current, {
          center: actual,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        const renderer = new window.google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: false,
        });

        setMap(newMap);
        setDirectionsRenderer(renderer);

        // Marcador de ubicación actual
        new window.google.maps.Marker({
          position: actual,
          map: newMap,
          title: 'Mi Ubicación',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });

        console.log('✅ Mapa inicializado correctamente');
      },
      (error) => {
        console.error('❌ Error obteniendo ubicación:', error);
        console.log('🌎 Usando Santiago como ubicación por defecto');

        // Si falla, usar Santiago como centro por defecto
        const santiago = { lat: -33.4489, lng: -70.6693 };
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: santiago,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        const renderer = new window.google.maps.DirectionsRenderer();
        renderer.setMap(newMap);
        setMap(newMap);
        setDirectionsRenderer(renderer);

        console.log('✅ Mapa inicializado con ubicación por defecto');
      }
    );
  };

  // SCRUM-92 + 95: Mostrar ruta en el mapa al hacer click
  const handleVerRutaEnMapa = async (ruta) => {
    console.log('🗺️ Intentando mostrar ruta:', ruta.origen, '→', ruta.destino);

    if (!map || !directionsRenderer) {
      console.log('❌ Mapa no inicializado');
      alert('El mapa aún no está cargado. Espera un momento e intenta de nuevo.');
      return;
    }

    setRutaSeleccionada(ruta);

    const directionsService = new window.google.maps.DirectionsService();

    // Usar las direcciones de origen y destino de la ruta
    directionsService.route(
      {
        origin: ruta.origen,
        destination: ruta.destino,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
          console.log('✅ Ruta dibujada en el mapa');

          // Hacer scroll al mapa
          mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.error('❌ Error al calcular ruta:', status);
          alert('No se pudo calcular la ruta en el mapa. Verifica las direcciones.');
        }
      }
    );
  };

  const limpiarMapa = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
      console.log('🗑️ Mapa limpiado');
    }
    setRutaSeleccionada(null);
  };

  // SCRUM-93: Funciones del modal
  const handleAbrirModal = () => setModalAbierto(true);
  const handleCerrarModal = () => setModalAbierto(false);
  const handleRutaCreada = () => cargarRutas();

  const handleCambiarEstado = async (rutaId, nuevoEstado) => {
    try {
      await rutasService.actualizar(rutaId, { estadoRuta: nuevoEstado });
      await cargarRutas(); // Recargar todas las rutas
      alert(`✅ Estado actualizado exitosamente. Los estados de la carga y vehículo también fueron actualizados.`);
    } catch (error) {
      alert(`❌ Error al cambiar estado: ${error}`);
      throw error;
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
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{ fontSize: '48px' }}>⏳</div>
          <p style={{ color: '#666', fontSize: '18px' }}>Cargando rutas...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', color: '#2c3e50' }}>
              🗺️ Gestión de Rutas
            </h1>
            <p style={{ color: '#7f8c8d', fontSize: '16px', margin: 0 }}>
              Administra las rutas de transporte y entregas
            </p>
          </div>

          <button
            onClick={handleAbrirModal}
            style={{
              padding: '14px 28px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '20px' }}>+</span>
            <span>Crear Nueva Ruta</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '16px 20px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* SCRUM-95: Mapa de Google */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginBottom: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
              🗺️ Mapa de Rutas
            </h2>
            {rutaSeleccionada && (
              <button
                onClick={limpiarMapa}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🗑️ Limpiar Mapa
              </button>
            )}
          </div>

          {rutaSeleccionada && (
            <div style={{
              padding: '12px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              marginBottom: '12px',
              fontSize: '14px',
              color: '#1565c0',
            }}>
              📍 Mostrando ruta: <strong>{rutaSeleccionada.origen}</strong> → <strong>{rutaSeleccionada.destino}</strong>
            </div>
          )}

          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '450px',
              borderRadius: '12px',
              border: '2px solid #e9ecef',
              backgroundColor: '#e5e3df',
            }}
          />
        </div>

        {/* SCRUM-91 + 92: Lista de rutas */}
        <div style={{
          backgroundColor: 'white',
          padding: '28px',
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '2px solid #f0f0f0',
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>
              Lista de Rutas
            </h2>
            <span style={{
              backgroundColor: '#667eea',
              color: 'white',
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '15px',
              fontWeight: '700',
            }}>
              {rutas.length} {rutas.length === 1 ? 'ruta' : 'rutas'}
            </span>
          </div>

          {rutas.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#999',
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗺️</div>
              <h3 style={{ color: '#666', fontWeight: '400' }}>No hay rutas registradas</h3>
              <p style={{ fontSize: '14px' }}>Crea la primera ruta para comenzar</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {rutas.map((ruta) => (
                <div
                  key={ruta.id}
                  style={{
                    padding: '20px',
                    border: rutaSeleccionada?.id === ruta.id ? '2px solid #667eea' : '2px solid #e9ecef',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    backgroundColor: rutaSeleccionada?.id === ruta.id ? '#f8f9ff' : 'white',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleVerRutaEnMapa(ruta)}
                  onMouseEnter={(e) => {
                    if (rutaSeleccionada?.id !== ruta.id) {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (rutaSeleccionada?.id !== ruta.id) {
                      e.currentTarget.style.borderColor = '#e9ecef';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr',
                    gap: '20px',
                    alignItems: 'center',
                  }}>
                    {/* Origen → Destino */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        Ruta
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                        📍 {ruta.origen}
                      </div>
                      <div style={{ fontSize: '14px', color: '#7f8c8d', margin: '4px 0' }}>
                        ↓
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                        🎯 {ruta.destino}
                      </div>
                      {ruta.distanciaKm && (
                        <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
                          📏 {ruta.distanciaKm} km
                        </div>
                      )}
                    </div>

                    {/* Vehículo */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        Vehículo
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#667eea' }}>
                        🚛 {ruta.vehiculo.patente}
                      </div>
                      <div style={{ fontSize: '13px', color: '#7f8c8d' }}>
                        {ruta.vehiculo.marca} {ruta.vehiculo.modelo}
                      </div>
                    </div>

                    {/* Carga */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                        Carga
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                        📦 {ruta.carga.descripcion}
                      </div>
                      <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                        ⚖️ {ruta.carga.peso} kg
                      </div>
                    </div>

                    {/* Estado con selector */}
                    <div style={{ textAlign: 'right' }}>
                      <SelectorEstadoRuta 
                        ruta={ruta}
                        onCambiarEstado={handleCambiarEstado}
                      />
                    </div>
                  </div>

                  {/* Conductor */}
                  {ruta.conductor && (
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid #f0f0f0',
                      fontSize: '13px',
                      color: '#7f8c8d',
                    }}>
                      👤 Conductor: <strong style={{ color: '#2c3e50' }}>{ruta.conductor.nombre}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SCRUM-93: Modal del formulario */}
      <FormularioRuta
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onRutaCreada={handleRutaCreada}
      />
    </div>
  );
}

export default Rutas;