import { useState, useEffect } from 'react';
import Navbar from "../Navbar/Navbar";
import usuariosService from '../../services/usuariosService';
import FormularioPerfil from './FormularioPerfil';
import FormularioContrasena from './FormularioContrasena';
import { setUsuario } from '../../config/api';

function Cuenta() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioContrasena, setMostrarFormularioContrasena] = useState(false);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.obtenerPerfil();
      setPerfil(data);
    } catch (err) {
      setError(err.message || 'Error al cargar perfil');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarPerfil = async (datos) => {
    try {
      const perfilActualizado = await usuariosService.actualizarPerfil(datos);
      setPerfil(perfilActualizado);
      setMostrarFormulario(false);
      
      // Actualizar también el usuario en localStorage
      setUsuario(perfilActualizado);
      
      alert('✅ Perfil actualizado exitosamente');
    } catch (error) {
      alert(`❌ Error: ${error}`);
    }
  };

  const handleCambiarContrasena = async (contrasenaActual, contrasenaNueva) => {
    try {
      await usuariosService.cambiarContrasena(contrasenaActual, contrasenaNueva);
      setMostrarFormularioContrasena(false);
      alert('✅ Contraseña actualizada exitosamente. Usa tu nueva contraseña en el próximo inicio de sesión.');
    } catch (error) {
      alert(`❌ Error: ${error}`);
      throw error; // Para que el formulario no se cierre si hay error
    }
  };

  const getRolInfo = (rol) => {
    const roles = {
      logistica: { nombre: 'Logística', icon: '🚚', color: '#27ae60' },
      rrhh: { nombre: 'Recursos Humanos', icon: '👥', color: '#3498db' },
      seguridad: { nombre: 'Seguridad', icon: '🛡️', color: '#f39c12' },
    };
    return roles[rol] || roles.logistica;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          ⏳ Cargando perfil...
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
            onClick={cargarPerfil}
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

  if (!perfil) return null;

  const rolInfo = getRolInfo(perfil.rol);

  return (
    <div>
      <Navbar />
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '32px 24px',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            👤 Mi Perfil
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#7f8c8d',
          }}>
            Información de tu cuenta
          </p>
        </div>

        {/* Card principal del perfil */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e9ecef',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        }}>
          {/* Banner superior con rol */}
          <div style={{
            background: `linear-gradient(135deg, ${rolInfo.color} 0%, ${rolInfo.color}dd 100%)`,
            padding: '48px 32px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              fontSize: '120px',
              opacity: '0.1',
            }}>
              {rolInfo.icon}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              position: 'relative',
              zIndex: 1,
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                border: '4px solid rgba(255, 255, 255, 0.3)',
              }}>
                {rolInfo.icon}
              </div>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '32px',
                  fontWeight: '700',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}>
                  {perfil.nombre}
                </h2>
                <div style={{
                  marginTop: '8px',
                  fontSize: '18px',
                  opacity: '0.95',
                  fontWeight: '500',
                }}>
                  {rolInfo.nombre}
                </div>
              </div>
            </div>
          </div>

          {/* Contenido del perfil */}
          <div style={{ padding: '32px' }}>
            {/* Información personal */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                📋 Información Personal
              </h3>

              <div style={{
                display: 'grid',
                gap: '20px',
              }}>
                {/* Email */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  borderLeft: '4px solid #667eea',
                }}>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px', fontWeight: '600' }}>
                    📧 Correo Electrónico
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50' }}>
                    {perfil.email}
                  </div>
                </div>

                {/* ID */}
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  borderLeft: '4px solid #667eea',
                }}>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px', fontWeight: '600' }}>
                    🆔 ID de Usuario
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                    #{perfil.id}
                  </div>
                </div>

                {/* Estado */}
                <div style={{
                  padding: '20px',
                  backgroundColor: perfil.activo ? '#d4edda' : '#f8d7da',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${perfil.activo ? '#27ae60' : '#e74c3c'}`,
                }}>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px', fontWeight: '600' }}>
                    📊 Estado de la Cuenta
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: perfil.activo ? '#155724' : '#721c24',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span>{perfil.activo ? '✅' : '⭕'}</span>
                    {perfil.activo ? 'Cuenta Activa' : 'Cuenta Inactiva'}
                  </div>
                </div>
              </div>
            </div>

            {/* Fechas importantes */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#2c3e50',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                📅 Fechas Importantes
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px',
              }}>
                <div style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  border: '2px solid #e9ecef',
                }}>
                  <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px', fontWeight: '600' }}>
                    Fecha de Registro
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                    {formatearFecha(perfil.createdAt)}
                  </div>
                </div>

                {perfil.updatedAt && (
                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                  }}>
                    <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px', fontWeight: '600' }}>
                      Última Actualización
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                      {formatearFecha(perfil.updatedAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '24px',
              borderTop: '2px solid #e9ecef',
            }}>
              <button
                onClick={() => setMostrarFormulario(true)}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
              >
                ✏️ Editar Perfil
              </button>

              <button
                onClick={() => setMostrarFormularioContrasena(true)}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  backgroundColor: '#f39c12',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e22'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
              >
                🔐 Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <FormularioPerfil
          perfil={perfil}
          onCerrar={() => setMostrarFormulario(false)}
          onGuardar={handleGuardarPerfil}
        />
      )}
      {/* Modal de cambiar contraseña */}
      {mostrarFormularioContrasena && (
        <FormularioContrasena
          onCerrar={() => setMostrarFormularioContrasena(false)}
          onGuardar={handleCambiarContrasena}
        />
      )}
    </div>
  );
}

export default Cuenta;