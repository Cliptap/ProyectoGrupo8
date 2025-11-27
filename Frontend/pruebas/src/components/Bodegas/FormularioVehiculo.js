import { useState } from 'react';
import { vehiculosService } from '../../services';

function FormularioVehiculo({ isOpen, onClose, onVehiculoCreado }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    capacidadCarga: '',
    estado: 'disponible',
    ubicacionActualLat: '',
    ubicacionActualLng: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.patente || !formData.marca || !formData.modelo || !formData.capacidadCarga) {
      setError('Por favor completa todos los campos obligatorios (Patente, Marca, Modelo, Capacidad)');
      return;
    }

    // Validar que capacidad sea un número válido
    if (isNaN(parseFloat(formData.capacidadCarga)) || parseFloat(formData.capacidadCarga) <= 0) {
      setError('La capacidad de carga debe ser un número mayor a 0');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Preparar datos para enviar (según tu backend)
      const dataToSend = {
        patente: formData.patente.toUpperCase().trim(),
        marca: formData.marca.trim(),
        modelo: formData.modelo.trim(),
        capacidadCarga: parseFloat(formData.capacidadCarga),
        estado: formData.estado,
      };

      // Agregar ubicación GPS solo si ambos campos están completos
      if (formData.ubicacionActualLat && formData.ubicacionActualLng) {
        dataToSend.ubicacionActualLat = parseFloat(formData.ubicacionActualLat);
        dataToSend.ubicacionActualLng = parseFloat(formData.ubicacionActualLng);
      }

      console.log('Enviando vehículo:', dataToSend);

      const nuevoVehiculo = await vehiculosService.crear(dataToSend);
      
      console.log('✅ Vehículo creado:', nuevoVehiculo);

      // Limpiar formulario
      setFormData({
        patente: '',
        marca: '',
        modelo: '',
        capacidadCarga: '',
        estado: 'disponible',
        ubicacionActualLat: '',
        ubicacionActualLng: '',
      });

      // Notificar al componente padre
      onVehiculoCreado();
      
      // Cerrar modal
      onClose();

    } catch (err) {
      console.error('❌ Error al crear vehículo:', err);
      setError(err || 'Error al crear el vehículo');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // Overlay del modal
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
    }}>
      {/* Modal */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header del modal */}
        <div style={{
          padding: '24px',
          borderBottom: '2px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#2c3e50' }}>
            Agregar Nuevo Vehículo
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
              padding: '0',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#f0f0f0';
                e.target.style.color = '#333';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#999';
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
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Grid de campos */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
          }}>
            {/* Patente */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>
                Patente <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="text"
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                placeholder="AA-BB-12"
                required
                style={inputStyle}
                disabled={loading}
              />
            </div>

            {/* Marca */}
            <div>
              <label style={labelStyle}>
                Marca <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Mercedes-Benz"
                required
                style={inputStyle}
                disabled={loading}
              />
            </div>

            {/* Modelo */}
            <div>
              <label style={labelStyle}>
                Modelo <span style={{ color: '#e74c3c' }}>*</span>
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Actros"
                required
                style={inputStyle}
                disabled={loading}
              />
            </div>

            {/* Año */}
            <div>
              <label style={labelStyle}>Capacidad de Carga (kg) <span style={{ color: '#e74c3c' }}>*</span></label>
              <input
                type="number"
                name="capacidadCarga"
                value={formData.capacidadCarga}
                onChange={handleChange}
                placeholder="25000"
                min="0"
                step="100"
                required
                style={inputStyle}
                disabled={loading}
              />
            </div>

            {/* Estado */}
            <div>
              <label style={labelStyle}>Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                style={inputStyle}
                disabled={loading}
              >
                <option value="disponible">✅ Disponible</option>
                <option value="en_ruta">��� En Ruta</option>
                <option value="mantenimiento">��� Mantenimiento</option>
              </select>
            </div>

            {/* Tipo de combustible */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Ubicación GPS (opcional)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <input
                    type="number"
                    name="ubicacionActualLat"
                    value={formData.ubicacionActualLat}
                    onChange={handleChange}
                    placeholder="Latitud: -33.4489"
                    step="any"
                    style={inputStyle}
                    disabled={loading}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="ubicacionActualLng"
                    value={formData.ubicacionActualLng}
                    onChange={handleChange}
                    placeholder="Longitud: -70.6693"
                    step="any"
                    style={inputStyle}
                    disabled={loading}
                  />
                </div>
              </div>
              <small style={{ color: '#999', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Ingresa la latitud y longitud del vehículo
              </small>
            </div>
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '32px',
            justifyContent: 'flex-end',
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#e9ecef',
                color: '#495057',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#dee2e6';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e9ecef';
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 32px',
                backgroundColor: loading ? '#999' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = '#5568d3';
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = '#667eea';
              }}
            >
              {loading ? (
                <>
                  <span>⏳</span>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Agregar Vehículo</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Estilos reutilizables
const labelStyle = {
  display: 'block',
  marginBottom: '6px',
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

export default FormularioVehiculo;
