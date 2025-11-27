function ModalDetalleTrabajador({ trabajador, onCerrar }) {
  if (!trabajador) return null;

  const getRolColor = (rol) => {
    const colores = {
      logistica: { bg: '#d4edda', color: '#155724', icon: '🚚' },
      rrhh: { bg: '#cfe2ff', color: '#084298', icon: '👔' },
      seguridad: { bg: '#fff3cd', color: '#856404', icon: '👮' },
    };
    return colores[rol] || colores.logistica;
  };

  const rolStyle = getRolColor(trabajador.rol);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        {/* Header del modal */}
        <div style={{
          padding: '32px',
          borderBottom: '2px solid #e9ecef',
          position: 'relative',
        }}>
          {/* Botón cerrar */}
          <button
            onClick={onCerrar}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#6c757d',
              lineHeight: 1,
              padding: '8px',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.color = '#e74c3c'}
            onMouseLeave={(e) => e.target.style.color = '#6c757d'}
          >
            ×
          </button>

          {/* Título y badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: rolStyle.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
            }}>
              {rolStyle.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: '700',
                color: '#2c3e50',
              }}>
                {trabajador.nombre}
              </h2>
              <div style={{
                marginTop: '8px',
                display: 'inline-block',
                backgroundColor: rolStyle.bg,
                color: rolStyle.color,
                padding: '6px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'uppercase',
              }}>
                {trabajador.rol}
              </div>
            </div>
          </div>

          {/* Estado */}
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            backgroundColor: trabajador.activo ? '#d4edda' : '#f8d7da',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '20px' }}>
              {trabajador.activo ? '✅' : '⭕'}
            </span>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: trabajador.activo ? '#155724' : '#721c24',
            }}>
              {trabajador.activo ? 'Trabajador Activo' : 'Trabajador Inactivo'}
            </span>
          </div>
        </div>

        {/* Contenido del modal */}
        <div style={{ padding: '32px' }}>
          {/* Información de contacto */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              📇 Información de Contacto
            </h3>

            <div style={{
              display: 'grid',
              gap: '16px',
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea',
              }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                  Email
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
                  📧 {trabajador.email}
                </div>
              </div>
            </div>
          </div>

          {/* Información del sistema */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#2c3e50',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              ℹ️ Información del Sistema
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                  ID de Usuario
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#667eea' }}>
                  🆔{trabajador.id}
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                  Fecha de Registro
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                  {formatearFecha(trabajador.createdAt)}
                </div>
              </div>

              {trabajador.updatedAt && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                    Última Actualización
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                    {formatearFecha(trabajador.updatedAt)}
                  </div>
                </div>
              )}
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
            onClick={onCerrar}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalDetalleTrabajador;
