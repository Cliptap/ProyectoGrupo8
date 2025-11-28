import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Autocomplete, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { vehiculosService, cargasService, usuariosService, rutasService } from '../../services';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const defaultCenter = {
  lat: -33.4489, // Santiago, Chile
  lng: -70.6693,
};

function FormularioRuta({ isOpen, onClose, onRutaCreada }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingOpciones, setLoadingOpciones] = useState(true);

  // Opciones para los dropdowns
  const [vehiculos, setVehiculos] = useState([]);
  const [cargas, setCargas] = useState([]);
  const [conductores, setConductores] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    vehiculoId: '',
    cargaId: '',
    conductorId: '',
  });

  // Para mostrar información adicional
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const [cargaSeleccionada, setCargaSeleccionada] = useState(null);

  // HU3: Estados para el mapa y autocompletado
  const [map, setMap] = useState(null);
  const [origenCoords, setOrigenCoords] = useState(null);
  const [destinoCoords, setDestinoCoords] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const autocompleteOrigenRef = useRef(null);
  const autocompleteDestinoRef = useRef(null);

  // HU3: Verificar si Google Maps está cargado (viene de index.html)
  // HU4: La API key se obtiene desde variable de entorno (REACT_APP_GOOGLE_MAPS_API_KEY)
  useEffect(() => {
    // Validar que la API key está disponible
    if (!window.__REACT_APP_GOOGLE_MAPS_API_KEY__) {
      setError('⚠️ HU4: API key de Google Maps no configurada. Configura REACT_APP_GOOGLE_MAPS_API_KEY en .env.local');
      console.error('HU4: API key no disponible en window.__REACT_APP_GOOGLE_MAPS_API_KEY__');
    }

    if (window.google && window.google.maps && window.google.maps.places) {
      setMapsLoaded(true);
    } else {
      // Si no está cargado, esperar un poco (polling simple)
      const interval = setInterval(() => {
        if (window.google && window.google.maps && window.google.maps.places) {
          setMapsLoaded(true);
          clearInterval(interval);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      cargarOpciones();
      // Resetear estados del mapa
      setOrigenCoords(null);
      setDestinoCoords(null);
      setDirections(null);
    }
  }, [isOpen]);

  // HU3: Calcular ruta cuando ambos puntos están seleccionados
  useEffect(() => {
    if (origenCoords && destinoCoords && mapsLoaded && window.google) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origenCoords,
          destination: destinoCoords,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
          } else {
            console.error('Error al calcular ruta:', status);
          }
        }
      );
    }
  }, [origenCoords, destinoCoords, mapsLoaded]);

  const cargarOpciones = async () => {
    try {
      setLoadingOpciones(true);

      // Cargar vehículos disponibles
      const vehiculosData = await vehiculosService.obtenerTodos();
      const vehiculosDisponibles = vehiculosData.filter(v => v.estado === 'disponible');
      setVehiculos(vehiculosDisponibles);

      // Cargar cargas pendientes
      const cargasData = await cargasService.obtenerTodos({ estado: 'pendiente' });
      setCargas(cargasData);

      // Cargar conductores activos
      const conductoresData = await usuariosService.obtenerConductores();
      setConductores(conductoresData);

      console.log('✅ Opciones cargadas:', {
        vehiculos: vehiculosDisponibles.length,
        cargas: cargasData.length,
        conductores: conductoresData.length
      });
    } catch (err) {
      console.error('❌ Error al cargar opciones:', err);
      setError('Error al cargar las opciones del formulario');
    } finally {
      setLoadingOpciones(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Si selecciona un vehículo, guardar info adicional
    if (name === 'vehiculoId') {
      const vehiculo = vehiculos.find(v => v.id === parseInt(value));
      setVehiculoSeleccionado(vehiculo);
    }

    // Si selecciona una carga, guardar info adicional
    if (name === 'cargaId') {
      const carga = cargas.find(c => c.id === parseInt(value));
      setCargaSeleccionada(carga);
    }
  };

  // HU3: Manejar selección de origen desde autocompletado
  const onOrigenPlaceChanged = () => {
    if (autocompleteOrigenRef.current) {
      const place = autocompleteOrigenRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setOrigenCoords(location);
        setFormData(prev => ({ ...prev, origen: place.formatted_address }));

        // Centrar mapa en el origen
        if (map) {
          map.panTo(location);
        }
      }
    }
  };

  // HU3: Manejar selección de destino desde autocompletado
  const onDestinoPlaceChanged = () => {
    if (autocompleteDestinoRef.current) {
      const place = autocompleteDestinoRef.current.getPlace();
      if (place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setDestinoCoords(location);
        setFormData(prev => ({ ...prev, destino: place.formatted_address }));

        // Centrar mapa en el destino
        if (map) {
          map.panTo(location);
        }
      }
    }
  };

  // Validar capacidad del vehículo
  const validarCapacidad = () => {
    if (!vehiculoSeleccionado || !cargaSeleccionada) {
      return { valido: true, mensaje: '' };
    }

    const capacidadVehiculo = vehiculoSeleccionado.capacidadCarga;
    const pesoCarga = cargaSeleccionada.peso;

    if (pesoCarga > capacidadVehiculo) {
      return {
        valido: false,
        mensaje: `⚠️ La carga (${pesoCarga} kg) excede la capacidad del vehículo (${capacidadVehiculo} kg)`
      };
    }

    const porcentajeUso = ((pesoCarga / capacidadVehiculo) * 100).toFixed(1);
    return {
      valido: true,
      mensaje: `✅ Capacidad OK (usando ${porcentajeUso}% del vehículo)`,
      porcentaje: porcentajeUso
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.origen || !formData.destino) {
      setError('Debes ingresar origen y destino');
      return;
    }

    if (!formData.vehiculoId || !formData.cargaId || !formData.conductorId) {
      setError('Debes seleccionar vehículo, carga y conductor');
      return;
    }

    // Validar capacidad
    const validacion = validarCapacidad();
    if (!validacion.valido) {
      setError(validacion.mensaje);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const dataToSend = {
        vehiculoId: parseInt(formData.vehiculoId),
        cargaId: parseInt(formData.cargaId),
        conductorId: parseInt(formData.conductorId),
        origen: formData.origen.trim(),
        destino: formData.destino.trim(),
      };

      console.log('📤 Creando ruta:', dataToSend);

      const nuevaRuta = await rutasService.crear(dataToSend);

      console.log('✅ Ruta creada:', nuevaRuta);

      // Limpiar formulario
      setFormData({
        origen: '',
        destino: '',
        vehiculoId: '',
        cargaId: '',
        conductorId: '',
      });
      setVehiculoSeleccionado(null);
      setCargaSeleccionada(null);
      setOrigenCoords(null);
      setDestinoCoords(null);
      setDirections(null);

      // Notificar al componente padre
      onRutaCreada();

      // Cerrar modal
      onClose();

    } catch (err) {
      console.error('❌ Error al crear ruta:', err);
      setError(err || 'Error al crear la ruta');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const validacion = validarCapacidad();

  return (
    <>
      {/* Overlay del modal */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        overflowY: 'auto',
      }}>
        {/* Modal */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '2px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <h2 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>
              🗺️ Crear Nueva Ruta
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '28px',
                cursor: loading ? 'not-allowed' : 'pointer',
                color: '#999',
              }}
            >
              ×
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* Error */}
            {error && (
              <div style={{
                backgroundColor: '#fee',
                color: '#c33',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px',
              }}>
                {error}
              </div>
            )}

            {loadingOpciones ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
                <p>Cargando opciones...</p>
              </div>
            ) : (
              <>
                {/* HU3: Mapa con preview */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>
                    🗺️ Previsualización de Ruta
                  </label>
                  {mapsLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={origenCoords || destinoCoords || defaultCenter}
                      zoom={origenCoords || destinoCoords ? 12 : 11}
                      onLoad={setMap}
                    >
                      {/* Marcador de origen */}
                      {origenCoords && (
                        <Marker
                          position={origenCoords}
                          label="O"
                          icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                          }}
                        />
                      )}

                      {/* Marcador de destino */}
                      {destinoCoords && (
                        <Marker
                          position={destinoCoords}
                          label="D"
                          icon={{
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                          }}
                        />
                      )}

                      {/* Ruta entre origen y destino */}
                      {directions && (
                        <DirectionsRenderer
                          directions={directions}
                          options={{
                            suppressMarkers: true,
                            polylineOptions: {
                              strokeColor: '#667eea',
                              strokeWeight: 5,
                            }
                          }}
                        />
                      )}
                    </GoogleMap>
                  ) : (
                    <div style={{ ...mapContainerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                      <p>Cargando mapa...</p>
                    </div>
                  )}
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '8px', display: 'block' }}>
                    {!origenCoords && !destinoCoords && 'Selecciona origen y destino para ver la ruta'}
                    {origenCoords && !destinoCoords && '✅ Origen seleccionado. Ahora selecciona el destino'}
                    {origenCoords && destinoCoords && '✅ Ruta calculada. Revisa el trazado antes de crear'}
                  </small>
                </div>

                {/* HU3: Origen con Autocomplete */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>
                    📍 Origen <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  {mapsLoaded ? (
                    <Autocomplete
                      onLoad={(autocomplete) => autocompleteOrigenRef.current = autocomplete}
                      onPlaceChanged={onOrigenPlaceChanged}
                      options={{
                        componentRestrictions: { country: 'cl' },
                      }}
                    >
                      <input
                        type="text"
                        name="origen"
                        value={formData.origen}
                        onChange={handleChange}
                        placeholder="Escribe y selecciona una dirección de origen"
                        required
                        style={inputStyle}
                        disabled={loading}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      type="text"
                      name="origen"
                      value={formData.origen}
                      onChange={handleChange}
                      placeholder="Cargando autocompletado..."
                      disabled
                      style={inputStyle}
                    />
                  )}
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Escribe para ver sugerencias de direcciones
                  </small>
                </div>

                {/* HU3: Destino con Autocomplete */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>
                    🎯 Destino <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  {mapsLoaded ? (
                    <Autocomplete
                      onLoad={(autocomplete) => autocompleteDestinoRef.current = autocomplete}
                      onPlaceChanged={onDestinoPlaceChanged}
                      options={{
                        componentRestrictions: { country: 'cl' },
                      }}
                    >
                      <input
                        type="text"
                        name="destino"
                        value={formData.destino}
                        onChange={handleChange}
                        placeholder="Escribe y selecciona una dirección de destino"
                        required
                        style={inputStyle}
                        disabled={loading}
                      />
                    </Autocomplete>
                  ) : (
                    <input
                      type="text"
                      name="destino"
                      value={formData.destino}
                      onChange={handleChange}
                      placeholder="Cargando autocompletado..."
                      disabled
                      style={inputStyle}
                    />
                  )}
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Escribe para ver sugerencias de direcciones
                  </small>
                </div>

                {/* Selección de Vehículo */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>
                    🚛 Vehículo <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <select
                    name="vehiculoId"
                    value={formData.vehiculoId}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    disabled={loading || vehiculos.length === 0}
                  >
                    <option value="">-- Selecciona un vehículo --</option>
                    {vehiculos.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.patente} - {v.marca} {v.modelo} (Cap: {v.capacidadCarga} kg)
                      </option>
                    ))}
                  </select>
                  {vehiculos.length === 0 && (
                    <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      No hay vehículos disponibles
                    </small>
                  )}
                </div>

                {/* Selección de Carga */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>
                    📦 Carga <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <select
                    name="cargaId"
                    value={formData.cargaId}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    disabled={loading || cargas.length === 0}
                  >
                    <option value="">-- Selecciona una carga --</option>
                    {cargas.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.descripcion} ({c.peso} kg - {c.tipo})
                      </option>
                    ))}
                  </select>
                  {cargas.length === 0 && (
                    <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      No hay cargas pendientes
                    </small>
                  )}
                </div>

                {/* Validación de capacidad */}
                {vehiculoSeleccionado && cargaSeleccionada && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    backgroundColor: validacion.valido ? '#d4edda' : '#f8d7da',
                    color: validacion.valido ? '#155724' : '#721c24',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}>
                    {validacion.mensaje}
                  </div>
                )}

                {/* Selección de Conductor */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>
                    👤 Conductor <span style={{ color: '#e74c3c' }}>*</span>
                  </label>
                  <select
                    name="conductorId"
                    value={formData.conductorId}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    disabled={loading || conductores.length === 0}
                  >
                    <option value="">-- Selecciona un conductor --</option>
                    {conductores.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} ({c.email})
                      </option>
                    ))}
                  </select>
                  {conductores.length === 0 && (
                    <small style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                      No hay conductores disponibles
                    </small>
                  )}
                </div>

                {/* Botones */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '32px',
                }}>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      backgroundColor: '#e9ecef',
                      color: '#495057',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !validacion.valido}
                    style={{
                      flex: 1,
                      padding: '12px 32px',
                      backgroundColor: loading || !validacion.valido ? '#999' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: loading || !validacion.valido ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? '⏳ Creando...' : '✅ Crear Ruta'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontSize: '13px',
  fontWeight: '600',
  color: '#555',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '2px solid #dee2e6',
  borderRadius: '8px',
  fontSize: '14px',
  backgroundColor: 'white',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};

export default FormularioRuta;