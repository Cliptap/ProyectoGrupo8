import { useState } from 'react';

function FormularioContrasena({ onCerrar, onGuardar }) {
  const [formData, setFormData] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: '',
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [mostrarContrasenas, setMostrarContrasenas] = useState({
    actual: false,
    nueva: false,
    confirmar: false,
  });

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

  const toggleMostrarContrasena = (campo) => {
    setMostrarContrasenas(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.contrasenaActual) {
      nuevosErrores.contrasenaActual = 'La contraseña actual es requerida';
    }

    if (!formData.contrasenaNueva) {
      nuevosErrores.contrasenaNueva = 'La nueva contraseña es requerida';
    } else if (formData.contrasenaNueva.length < 6) {
      nuevosErrores.contrasenaNueva = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Debes confirmar la nueva contraseña';
    } else if (formData.contrasenaNueva !== formData.confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
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
      await onGuardar(formData.contrasenaActual, formData.contrasenaNueva);
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
          maxWidth: '500px',
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
            🔐 Cambiar Contraseña
          </h2>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '14px',
            color: '#6c757d',
          }}>
            Actualiza tu contraseña de acceso
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            {/* Contraseña Actual */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Contraseña Actual *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarContrasenas.actual ? 'text' : 'password'}
                  name="contrasenaActual"
                  value={formData.contrasenaActual}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Ingresa tu contraseña actual"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '45px',
                    fontSize: '16px',
                    border: `2px solid ${errores.contrasenaActual ? '#e74c3c' : '#dee2e6'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: guardando ? '#f8f9fa' : 'white',
                    cursor: guardando ? 'not-allowed' : 'text',
                  }}
                  onFocus={(e) => !errores.contrasenaActual && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !errores.contrasenaActual && (e.target.style.borderColor = '#dee2e6')}
                />
                <button
                  type="button"
                  onClick={() => toggleMostrarContrasena('actual')}
                  disabled={guardando}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: guardando ? 'not-allowed' : 'pointer',
                    padding: '5px',
                    opacity: guardando ? 0.5 : 1,
                  }}
                >
                  {mostrarContrasenas.actual ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errores.contrasenaActual && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.contrasenaActual}
                </div>
              )}
            </div>

            {/* Nueva Contraseña */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Nueva Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarContrasenas.nueva ? 'text' : 'password'}
                  name="contrasenaNueva"
                  value={formData.contrasenaNueva}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Mínimo 6 caracteres"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '45px',
                    fontSize: '16px',
                    border: `2px solid ${errores.contrasenaNueva ? '#e74c3c' : '#dee2e6'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: guardando ? '#f8f9fa' : 'white',
                    cursor: guardando ? 'not-allowed' : 'text',
                  }}
                  onFocus={(e) => !errores.contrasenaNueva && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !errores.contrasenaNueva && (e.target.style.borderColor = '#dee2e6')}
                />
                <button
                  type="button"
                  onClick={() => toggleMostrarContrasena('nueva')}
                  disabled={guardando}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: guardando ? 'not-allowed' : 'pointer',
                    padding: '5px',
                    opacity: guardando ? 0.5 : 1,
                  }}
                >
                  {mostrarContrasenas.nueva ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errores.contrasenaNueva && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.contrasenaNueva}
                </div>
              )}
            </div>

            {/* Confirmar Nueva Contraseña */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '8px',
              }}>
                Confirmar Nueva Contraseña *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mostrarContrasenas.confirmar ? 'text' : 'password'}
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  disabled={guardando}
                  placeholder="Repite la nueva contraseña"
                  style={{
                    width: '100%',
                    padding: '12px',
                    paddingRight: '45px',
                    fontSize: '16px',
                    border: `2px solid ${errores.confirmarContrasena ? '#e74c3c' : '#dee2e6'}`,
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: guardando ? '#f8f9fa' : 'white',
                    cursor: guardando ? 'not-allowed' : 'text',
                  }}
                  onFocus={(e) => !errores.confirmarContrasena && (e.target.style.borderColor = '#667eea')}
                  onBlur={(e) => !errores.confirmarContrasena && (e.target.style.borderColor = '#dee2e6')}
                />
                <button
                  type="button"
                  onClick={() => toggleMostrarContrasena('confirmar')}
                  disabled={guardando}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: guardando ? 'not-allowed' : 'pointer',
                    padding: '5px',
                    opacity: guardando ? 0.5 : 1,
                  }}
                >
                  {mostrarContrasenas.confirmar ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errores.confirmarContrasena && (
                <div style={{ color: '#e74c3c', fontSize: '12px', marginTop: '4px' }}>
                  {errores.confirmarContrasena}
                </div>
              )}
            </div>

            {/* Nota de seguridad */}
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffc107',
              marginTop: '16px',
            }}>
              <div style={{
                fontSize: '13px',
                color: '#856404',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                <span>
                  Asegúrate de recordar tu nueva contraseña. La necesitarás para iniciar sesión la próxima vez.
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
                backgroundColor: guardando ? '#95a5a6' : '#f39c12',
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
              onMouseEnter={(e) => !guardando && (e.target.style.backgroundColor = '#e67e22')}
              onMouseLeave={(e) => !guardando && (e.target.style.backgroundColor = '#f39c12')}
            >
              {guardando ? '⏳ Actualizando...' : '🔐 Cambiar Contraseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormularioContrasena;