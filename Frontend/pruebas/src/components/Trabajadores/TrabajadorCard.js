function TrabajadorCard({ trabajador, onVerDetalle, onEditar, onEliminar, usuarioActual }) {
  const getRolColor = (rol) => {
    const colores = {
      logistica: { bg: '#d4edda', color: '#155724', icon: '🚚' },
      rrhh: { bg: '#cfe2ff', color: '#084298', icon: '👔' },
      seguridad: { bg: '#fff3cd', color: '#856404', icon: '👮' },
    };
    return colores[rol] || colores.logistica;
  };

  const rolStyle = getRolColor(trabajador.rol);

  // Lógica: RRHH puede eliminar a otros departamentos, pero no a RRHH
  const puedeEliminar = usuarioActual?.rol === 'rrhh' && trabajador.rol !== 'rrhh';

  return (
    <div style={{
      backgroundColor: 'white',
      border: '2px solid #e9ecef',
      borderRadius: '16px',
      padding: '24px',
      transition: 'all 0.3s',
      position: 'relative',
      overflow: 'hidden',
      opacity: trabajador.activo ? 1 : 0.6,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
      e.currentTarget.style.borderColor = '#667eea';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#e9ecef';
    }}
    >
      {/* Barra superior con rol */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: rolStyle.bg,
      }} />

      {/* Header del card */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#2c3e50',
            marginBottom: '8px',
          }}>
            {trabajador.nombre}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#7f8c8d',
            fontWeight: '500',
          }}>
            📧 {trabajador.email}
          </div>
        </div>

        {/* Badge de rol */}
        <div style={{
          backgroundColor: rolStyle.bg,
          color: rolStyle.color,
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>{rolStyle.icon}</span>
          <span style={{ textTransform: 'uppercase' }}>{trabajador.rol}</span>
        </div>
      </div>

      {/* Información del trabajador */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        marginBottom: '20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '18px' }}></span>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>ID</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2c3e50' }}>
              🆔{trabajador.id}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '18px' }}>{trabajador.activo ? '✅' : '⭕'}</span>
          <div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>Estado</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: trabajador.activo ? '#27ae60' : '#e74c3c' 
            }}>
              {trabajador.activo ? 'Activo' : 'Inactivo'}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '16px',
      }}>
        <button
          onClick={() => onVerDetalle(trabajador)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#5568d3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#667eea'}
        >
          🔍Ver
        </button>

        <button
          onClick={() => onEditar(trabajador)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#f39c12',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e67e22'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#f39c12'}
        >
          ✏️ Editar
        </button>

        {puedeEliminar && (
          <button
            onClick={() => onEliminar(trabajador)}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
          >
            🗑️Eliminar
          </button>
        )}
      </div>
    </div>
  );
}

export default TrabajadorCard;
