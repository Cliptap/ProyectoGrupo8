import { useState } from 'react';

function FormularioTrabajador({ onCerrar, onGuardar, trabajador = null }) {
  const esEdicion = !!trabajador;

  const [formData, setFormData] = useState({
    nombre: trabajador?.nombre || '',
    email: trabajador?.email || '',
    password: '',
    rol: trabajador?.rol || 'logistica',
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

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'Email inválido';
    }

    if (!esEdicion && !formData.password) {
      nuevosErrores.password = 'La contraseña es requerida';
    }

    if (!esEdicion && formData.password && formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.rol) {
      nuevosErrores.rol = 'El rol es requerido';
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
            {esEdicion ? '✏️ Editar Trabajador' : '➕ Nuevo Trabajador'}
          </h2>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: '#6c757d',
          }}>
            {esEdicion ? 'Modifica la información del trabajador' : 'Completa los datos del nuevo trabajador'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            {/* Nombre */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                disabled={guardando}
                placeholder="Ej: Juan Pérez González"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.nombre ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: guardando ? '#f8f9fa' : 'white',
                  cursor: guardando ? 'not-allowed' : 'text',
                }}
                onFocus={(e) => !errores.nombre && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.nombre && (e.target.style.borderColor = '#dee2e6')}
              />
              {errores.nombre && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.nombre}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Email Corporativo *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={guardando || esEdicion}
                placeholder="ejemplo@luxchile.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.email ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: (guardando || esEdicion) ? '#f8f9fa' : 'white',
                  cursor: (guardando || esEdicion) ? 'not-allowed' : 'text',
                }}
                onFocus={(e) => !errores.email && !esEdicion && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.email && (e.target.style.borderColor = '#dee2e6')}
              />
              {errores.email && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.email}
                </div>
              )}
              {esEdicion && (
                <div style={{ color: '#6c757d', fontSize: '12px', marginTop: '4px' }}>
                  ℹ️ El email no puede ser modificado
                </div>
              )}
            </div>

            {/* Contraseña */}
            {!esEdicion && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '8px',
                }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Mínimo 6 caracteres"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: `2px solid ${errores.password ? '#e74c3c' : '#dee2e6'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: guardando ? '#f8f9fa' : 'white',
                    cursor: guardando ? 'not-allowed' : 'text',
                  }}
                  onFocus={(e) => !errores.password && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !errores.password && (e.target.style.borderColor = '#dee2e6')}
                />
                {errores.password && (
                  <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                    {errores.password}
                  </div>
                )}
              </div>
            )}

            {/* Rol */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Departamento / Rol *
              </label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                disabled={guardando}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  border: `2px solid ${errores.rol ? '#e74c3c' : '#dee2e6'}`,
                  borderRadius: '8px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: guardando ? '#f8f9fa' : 'white',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                }}
                onFocus={(e) => !errores.rol && (e.target.style.borderColor = '#667eea')}
                onBlur={(e) => !errores.rol && (e.target.style.borderColor = '#dee2e6')}
              >
                <option value="logistica">🚚 Logística</option>
                <option value="rrhh">👥 Recursos Humanos</option>
                <option value="seguridad">🛡️ Seguridad</option>
              </select>
              {errores.rol && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.rol}
                </div>
              )}
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
              {guardando ? '⏳ Guardando...' : (esEdicion ? '💾 Actualizar' : '➕ Crear Trabajador')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioTrabajador;