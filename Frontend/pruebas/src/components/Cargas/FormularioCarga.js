import { useState } from 'react';

function FormularioCarga({ onCerrar, onGuardar }) {
  const [formData, setFormData] = useState({
    descripcion: '',
    peso: '',
    tipo: 'normal',
    prioridad: 'media',
    origen: '',
    destino: '',
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo al escribir
    if (errores[name]) {
      setErrores(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es requerida';
    }

    if (!formData.peso) {
      nuevosErrores.peso = 'El peso es requerido';
    } else if (parseFloat(formData.peso) <= 0) {
      nuevosErrores.peso = 'El peso debe ser mayor a 0';
    }

    if (!formData.tipo) {
      nuevosErrores.tipo = 'El tipo es requerido';
    }

    if (!formData.prioridad) {
      nuevosErrores.prioridad = 'La prioridad es requerida';
    }

    if (!formData.origen.trim()) {
      nuevosErrores.origen = 'El origen es requerido';
    }

    if (!formData.destino.trim()) {
      nuevosErrores.destino = 'El destino es requerido';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      await onGuardar(formData);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      style={{
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
      }}
      onClick={onCerrar}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: '2px solid #e9ecef',
          position: 'relative',
        }}>
          <button
            onClick={onCerrar}
            disabled={guardando}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: guardando ? 'not-allowed' : 'pointer',
              color: '#6c757d',
              lineHeight: 1,
              padding: '8px',
              transition: 'color 0.2s',
              opacity: guardando ? 0.5 : 1,
            }}
            onMouseEnter={(e) => !guardando && (e.target.style.color = '#e74c3c')}
            onMouseLeave={(e) => e.target.style.color = '#6c757d'}
          >
            ×
          </button>

          <h2 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            color: '#2c3e50',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            ➕ Nueva Carga
          </h2>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: '#6c757d',
          }}>
            Registra una nueva carga en el sistema
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            {/* Descripción */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Descripción de la Carga *
              </label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={guardando}
                placeholder="Ej: Electrodomésticos, Alimentos, etc."
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.descripcion ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: guardando ? '#f8f9fa' : 'white',
                  cursor: guardando ? 'not-allowed' : 'text',
                }}
                onFocus={(e) => !errores.descripcion && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.descripcion && (e.target.style.borderColor = '#dee2e6')}
              />
              {errores.descripcion && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.descripcion}
                </div>
              )}
            </div>

            {/* Peso y Tipo en dos columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Peso */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                }}>
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  name="peso"
                  value={formData.peso}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: `2px solid ${errores.peso ? '#e74c3c' : '#dee2e6'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: guardando ? '#f8f9fa' : 'white',
                    cursor: guardando ? 'not-allowed' : 'text',
                  }}
                  onFocus={(e) => !errores.peso && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !errores.peso && (e.target.style.borderColor = '#dee2e6')}
                />
                {errores.peso && (
                  <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                    {errores.peso}
                  </div>
                )}
              </div>

              {/* Tipo */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                }}>
                  Tipo de Carga *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  disabled={guardando}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: `2px solid ${errores.tipo ? '#e74c3c' : '#dee2e6'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: guardando ? '#f8f9fa' : 'white',
                    cursor: guardando ? 'not-allowed' : 'pointer',
                  }}
                  onFocus={(e) => !errores.tipo && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !errores.tipo && (e.target.style.borderColor = '#dee2e6')}
                >
                  <option value="normal">📦 Normal</option>
                  <option value="fragil">🔴 Frágil</option>
                  <option value="peligrosa">⚠️ Peligrosa</option>
                  <option value="refrigerada">❄️ Refrigerada</option>
                </select>
              </div>
            </div>

            {/* Prioridad */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Prioridad *
              </label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                disabled={guardando}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.prioridad ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: guardando ? '#f8f9fa' : 'white',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                }}
                onFocus={(e) => !errores.prioridad && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.prioridad && (e.target.style.borderColor = '#dee2e6')}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            {/* Origen */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Origen *
              </label>
              <input
                type="text"
                name="origen"
                value={formData.origen}
                onChange={handleChange}
                disabled={guardando}
                placeholder="Ej: Bodega Central, Santiago"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.origen ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: guardando ? '#f8f9fa' : 'white',
                  cursor: guardando ? 'not-allowed' : 'text',
                }}
                onFocus={(e) => !errores.origen && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.origen && (e.target.style.borderColor = '#dee2e6')}
              />
              {errores.origen && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.origen}
                </div>
              )}
            </div>

            {/* Destino */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Destino *
              </label>
              <input
                type="text"
                name="destino"
                value={formData.destino}
                onChange={handleChange}
                disabled={guardando}
                placeholder="Ej: Tienda Providencia, Santiago"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.destino ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: guardando ? '#f8f9fa' : 'white',
                  cursor: guardando ? 'not-allowed' : 'text',
                }}
                onFocus={(e) => !errores.destino && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.destino && (e.target.style.borderColor = '#dee2e6')}
              />
              {errores.destino && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.destino}
                </div>
              )}
            </div>

            {/* Nota informativa */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#e7f3ff',
              borderRadius: '8px',
              border: '1px solid #b3d9ff',
              marginTop: '16px',
            }}>
              <div style={{
                fontSize: '13px',
                color: '#004085',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>ℹ️</span>
                <span>
                  La carga se creará con estado <strong>"pendiente"</strong>. Podrás asignarla a una ruta desde el módulo de Rutas.
                </span>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div style={{
            padding: '24px 32px',
            borderTop: '2px solid #e9ecef',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              type="button"
              onClick={onCerrar}
              disabled={guardando}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: guardando ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                opacity: guardando ? 0.5 : 1,
              }}
              onMouseEnter={(e) => !guardando && (e.target.style.backgroundColor = '#5a6268')}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              style={{
                padding: '12px 24px',
                backgroundColor: guardando ? '#95a5a6' : '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: guardando ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => !guardando && (e.target.style.backgroundColor = '#229954')}
              onMouseLeave={(e) => !guardando && (e.target.style.backgroundColor = '#27ae60')}
            >
              {guardando ? '⏳ Guardando...' : '➕ Crear Carga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioCarga;